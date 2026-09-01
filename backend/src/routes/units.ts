import express from 'express';
import { prisma } from '../prisma';
import { logAudit } from '../utils/audit';

const router = express.Router();

// GET /api/units?variantId=
router.get('/', async (req, res) => {
  const variantId = req.query.variantId ? Number(req.query.variantId) : undefined;
  const where = variantId ? { where: { variantId } } : {} as any;
  const units = await prisma.productUnit.findMany(variantId ? { where: { variantId } } : {});
  res.json(units);
});

// POST /api/units - create units (serial optional)
router.post('/', async (req: any, res) => {
  const { variantId, serials } = req.body; // serials: array of strings or null to create 'bulk' without serials
  if (!variantId) return res.status(400).json({ error: 'variantId required' });
  const created: any[] = [];
  if (Array.isArray(serials) && serials.length) {
    for (const s of serials) {
      const u = await prisma.productUnit.create({ data: { variantId, serial: s, status: 'in_stock' } });
      created.push(u);
    }
  } else {
    // create one unit without serial
    const u = await prisma.productUnit.create({ data: { variantId, serial: null, status: 'in_stock' } });
    created.push(u);
  }
  await logAudit(req.user?.id, 'create_units', 'product_unit', null, null, created);
  res.status(201).json(created);
});

// PATCH /api/units/:id - update status (sold/reserved)
router.patch('/:id', async (req: any, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'status required' });
  try {
    const oldUnit = await prisma.productUnit.findUnique({ where: { id } });
    const updated = await prisma.productUnit.update({ where: { id }, data: { status } });
    await logAudit(req.user?.id, 'update_unit', 'product_unit', String(id), oldUnit, updated);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update unit' });
  }
});

export default router;
