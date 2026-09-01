import express from 'express';
import { prisma } from '../prisma';
import { logAudit } from '../utils/audit';

const router = express.Router();

// POST /api/purchases
router.post('/', async (req: any, res) => {
  try {
    const user = req.user;
    const { supplierId, invoiceNo, items, totalAmount } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'items required' });
    const purchase = await prisma.purchase.create({ data: { supplierId: supplierId || undefined, invoiceNo: invoiceNo || undefined, totalAmount: totalAmount || 0 } });
    for (const it of items) {
      await prisma.purchaseItem.create({ data: { purchaseId: purchase.id, variantId: it.variantId, quantity: it.quantity, priceBuy: it.priceBuy || 0 } });
      // stock movement: increase
      await prisma.stockMovement.create({ data: { warehouseId: 1, variantId: it.variantId, change: Math.abs(it.quantity), type: 'purchase', referenceId: purchase.id.toString(), createdBy: user?.email || 'system' } });
      const existing = await prisma.stockBalance.findUnique({ where: { warehouseId_variantId: { warehouseId: 1, variantId: it.variantId } } });
      if (existing) {
        await prisma.stockBalance.update({ where: { id: existing.id }, data: { quantity: existing.quantity + it.quantity } });
      } else {
        await prisma.stockBalance.create({ data: { warehouseId: 1, variantId: it.variantId, quantity: it.quantity } });
      }
    }
    await logAudit(user?.id, 'create_purchase', 'purchase', purchase.id.toString(), null, purchase);
    res.status(201).json({ purchaseId: purchase.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create purchase' });
  }
});

export default router;
