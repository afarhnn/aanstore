import express from 'express';
import { prisma } from '../prisma';
import { authorize } from '../middleware/roles';
import { logAudit } from '../utils/audit';

const router = express.Router();

// GET /api/users (admin only)
router.get('/', authorize(['admin']), async (req, res) => {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } });
  res.json(users);
});

// POST /api/users (admin create)
router.post('/', authorize(['admin']), async (req: any, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });
  try {
    const created = await prisma.user.create({ data: { name, email, password, role: role || 'kasir' } });
    await logAudit(req.user?.id, 'create_user', 'user', String(created.id), null, { id: created.id, email: created.email, name: created.name, role: created.role });
    res.status(201).json({ id: created.id, email: created.email, name: created.name, role: created.role });
  } catch (err: any) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Email already exists' });
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT /api/users/:id (admin)
router.put('/:id', authorize(['admin']), async (req: any, res) => {
  const id = Number(req.params.id);
  const { name, role } = req.body;
  try {
    const oldUser = await prisma.user.findUnique({ where: { id } });
    const updated = await prisma.user.update({ where: { id }, data: { name: name || oldUser?.name, role: role || oldUser?.role } });
    await logAudit(req.user?.id, 'update_user', 'user', String(id), oldUser, { id: updated.id, name: updated.name, role: updated.role });
    res.json({ id: updated.id, name: updated.name, role: updated.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id (admin)
router.delete('/:id', authorize(['admin']), async (req: any, res) => {
  const id = Number(req.params.id);
  try {
    const oldUser = await prisma.user.findUnique({ where: { id } });
    await prisma.user.delete({ where: { id } });
    await logAudit(req.user?.id, 'delete_user', 'user', String(id), oldUser, null);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
