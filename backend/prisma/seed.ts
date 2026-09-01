// Seed script for Prisma (simplified)
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aanstore.local' },
    update: {},
    create: { name: 'Admin', email: 'admin@aanstore.local', password: 'Admin123!', role: 'admin' }
  });
  const wh = await prisma.warehouse.upsert({ where: { id: 1 }, update: {}, create: { id: 1, name: 'Toko Utama', address: 'Alamat Toko' } });
  const p = await prisma.product.create({ data: { brand: 'ContohBrand', model: 'Model X', category: 'Smartphone', description: 'Sample phone', variants: { create: [{ color: 'Black', capacity: '128GB', priceBuy: 200.0, priceSell: 250.0 }] } }, include: { variants: true } });
  const variant = p.variants[0];
  await prisma.stockBalance.create({ data: { warehouseId: 1, variantId: variant.id, quantity: 10 } });
  console.log('Seed done');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
