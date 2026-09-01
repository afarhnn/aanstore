import express from 'express';
import { prisma } from '../prisma';
import { logAudit } from '../utils/audit';

const router = express.Router();

// POST /api/sales
router.post('/', async (req: any, res) => {
  try {
    const user = req.user;
    const { items, totalAmount, paymentMethod, customerName } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'items required' });
    const invoiceNo = `AAN-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Date.now().toString().slice(-4)}`;
    const sale = await prisma.sale.create({ data: { invoiceNo, customerName: customerName || null, totalAmount: totalAmount || 0, totalItems: items.length, paymentMethod: paymentMethod || 'cash' } });
    for (const it of items) {
      await prisma.saleItem.create({ data: { saleId: sale.id, variantId: it.variantId, quantity: it.quantity, priceSell: it.priceSell || 0, discount: it.discount || 0 } });
      // stock movement
      await prisma.stockMovement.create({ data: { warehouseId: 1, variantId: it.variantId, change: -Math.abs(it.quantity), type: 'sale', referenceId: sale.id.toString(), createdBy: user?.email || 'system' } });
      // update stock balance
      const existing = await prisma.stockBalance.findUnique({ where: { warehouseId_variantId: { warehouseId: 1, variantId: it.variantId } } });
      if (existing) {
        await prisma.stockBalance.update({ where: { id: existing.id }, data: { quantity: existing.quantity - it.quantity } });
      }
    }
    // create cashbook entry if cash or transfer
    if (paymentMethod === 'cash' || paymentMethod === 'transfer') {
      await prisma.cashbookEntry.create({ data: { date: new Date(), type: 'in', amount: totalAmount || 0, method: paymentMethod, reference: sale.id.toString(), description: `Sale ${invoiceNo}`, createdBy: user?.email || 'system' } });
    }
    await logAudit(user?.id, 'create_sale', 'sale', sale.id.toString(), null, sale);
    res.status(201).json({ saleId: sale.id, invoiceNo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create sale' });
  }
});

export default router;
