import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function logAudit(userId: number | undefined, action: string, tableName: string, recordId: string | null, oldValue: any, newValue: any) {
  try {
    await prisma.auditLog.create({ data: { userId: userId ? Number(userId) : undefined, action, tableName, recordId: recordId ? recordId : undefined, oldValue: oldValue ? oldValue : undefined, newValue: newValue ? newValue : undefined } });
  } catch (err) {
    console.error('Failed to write audit log', err);
  }
}
