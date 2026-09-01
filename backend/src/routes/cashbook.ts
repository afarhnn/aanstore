import express from 'express';
import { prisma } from '../prisma';

const router = express.Router();

// GET /api/cashbook?from=&to=
router.get('/', async (req, res) => {
  const from = req.query.from ? new Date(String(req.query.from)) : new Date('1970-01-01');
  const to = req.query.to ? new Date(String(req.query.to)) : new Date();
  const entries = await prisma.cashbookEntry.findMany({ where: { date: { gte: from, lte: to } }, orderBy: { date: 'desc' } });
  res.json(entries);
});

// POST /api/cashbook
router.post('/', async (req: any, res) => {
  const { date, type, amount, method, reference, description } = req.body;
  if (!type || !amount) return res.status(400).json({ error: 'type and amount required' });
  const entry = await prisma.cashbookEntry.create({ data: { date: date ? new Date(date) : new Date(), type, amount, method, reference: reference?.toString(), description, createdBy: req.user?.email || 'system' } });
  res.status(201).json(entry);
});

export default router;
