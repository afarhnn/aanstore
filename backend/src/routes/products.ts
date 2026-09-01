import express from 'express';
import { prisma } from '../prisma';

const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
  const q = String(req.query.q || '');
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { brand: { contains: q, mode: 'insensitive' } },
        { model: { contains: q, mode: 'insensitive' } },
      ],
    },
    include: { variants: true },
    orderBy: { updatedAt: 'desc' },
    take: 100,
  });
  res.json(products);
});

// POST /api/products
router.post('/', async (req, res) => {
  const { brand, model, category, description, variants } = req.body;
  if (!brand || !model) return res.status(400).json({ error: 'brand and model required' });
  try {
    const created = await prisma.product.create({
      data: {
        brand,
        model,
        category,
        description,
        variants: variants && variants.length ? { create: variants } : undefined,
      },
      include: { variants: true },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

export default router;
