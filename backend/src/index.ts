import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ok:true, env: process.env.NODE_ENV || 'development'}));

// Minimal auth stub
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  // NOTE: implement real auth later; this is placeholder for scaffold
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  // skipping password check in scaffold
  res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, accessToken: 'dev-token' });
});

// Products stub
app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany({ include: { variants: true } });
  res.json(products);
});

// Sales stub
app.post('/api/sales', async (req, res) => {
  const { items, total_amount } = req.body;
  // basic create
  const sale = await prisma.sale.create({ data: { invoice_no: `S-${Date.now()}`, total_amount, total_items: items?.length || 0 } });
  // create sale items (simplified)
  if (items && items.length) {
    for (const it of items) {
      await prisma.saleItem.create({ data: { saleId: sale.id, variantId: it.variantId, quantity: it.quantity, priceSell: it.priceSell || 0 } });
      await prisma.stockMovement.create({ data: { warehouseId: 1, variantId: it.variantId, change: -Math.abs(it.quantity), type: 'sale', referenceId: sale.id.toString(), createdBy: 'system' } });
      // update stock balances
      const bal = await prisma.stockBalance.findUnique({ where: { warehouseId_variantId: { warehouseId: 1, variantId: it.variantId } } });
      if (bal) {
        await prisma.stockBalance.update({ where: { id: bal.id }, data: { quantity: bal.quantity - it.quantity } });
      }
    }
  }
  res.json({ saleId: sale.id });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
