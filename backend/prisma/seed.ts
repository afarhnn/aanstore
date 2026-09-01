import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aanstore.local' },
    update: { password: hashed },
    create: { name: 'Admin', email: 'admin@aanstore.local', password: hashed, role: 'admin' }
  });
  const wh = await prisma.warehouse.upsert({ where: { id: 1 }, update: {}, create: { id: 1, name: 'AanStore', address: 'Alamat Toko' } });
  const p = await prisma.product.create({ data: { brand: 'ContohBrand', model: 'Model X', category: 'Smartphone', description: 'Sample phone', variants: { create: [{ color: 'Black', capacity: '128GB', priceBuy: 200.0, priceSell: 250.0 }] } }, include: { variants: true } });
  const variant = p.variants[0];
  // create stock balance only if not exists
  const existing = await prisma.stockBalance.findFirst({ where: { warehouseId: 1, variantId: variant.id } });
  if (!existing) {
    await prisma.stockBalance.create({ data: { warehouseId: 1, variantId: variant.id, quantity: 10 } });
  }
  console.log('Seed done');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
