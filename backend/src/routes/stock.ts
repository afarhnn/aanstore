import express from 'express';
import { prisma } from '../prisma';
import { logAudit } from '../utils/audit';

const router = express.Router();

// GET /api/stock - list balances
router.get('/', async (req, res) => {
  const balances = await prisma.stockBalance.findMany({ include: { /* no relations for now */ } });
  res.json(balances);
});

// GET /api/stock/:variantId/movements
router.get('/:variantId/movements', async (req, res) => {
  const variantId = Number(req.params.variantId);
  const movements = await prisma.stockMovement.findMany({ where: { variantId }, orderBy: { createdAt: 'desc' }, take: 200 });
  res.json(movements);
});

// POST /api/stock/move - manual adjustment
router.post('/move', async (req: any, res) => {
  const { warehouseId, variantId, change, type, referenceId, note } = req.body;
  const user = req.user;
  if (!warehouseId || !variantId || !change || !type) return res.status(400).json({ error: 'warehouseId, variantId, change, type required' });
  const move = await prisma.stockMovement.create({ data: { warehouseId, variantId, change, type, referenceId: referenceId?.toString(), note, createdBy: user?.email || 'system' } });
  const bal = await prisma.stockBalance.upsert({ where: { warehouseId_variantId: { warehouseId, variantId } }, update: { quantity: { decrement: change < 0 ? Math.abs(change) : 0 } }, create: { warehouseId, variantId, quantity: change > 0 ? change : 0 } as any });
  // the upsert above uses decrement which may not be ideal for all DB clients; fallback update
  try {
    const existing = await prisma.stockBalance.findUnique({ where: { warehouseId_variantId: { warehouseId, variantId } } });
    if (existing) {
      await prisma.stockBalance.update({ where: { id: existing.id }, data: { quantity: existing.quantity + change } });
    } else {
      await prisma.stockBalance.create({ data: { warehouseId, variantId, quantity: change } });
    }
  } catch (err) {
    // ignore
  }
  await logAudit(user?.id, 'stock_move', 'stock_movement', move.id.toString(), null, move);
  res.json(move);
});

export default router;
