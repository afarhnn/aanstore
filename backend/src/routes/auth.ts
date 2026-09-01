import express from 'express';
import { prisma } from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'changeme', { expiresIn: '4h' });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET || 'changeme', { expiresIn: '7d' });

  res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, accessToken, refreshToken });
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET || 'changeme') as any;
    // issue new access token
    const accessToken = jwt.sign({ id: payload.id, email: payload.email, role: payload.role }, process.env.JWT_SECRET || 'changeme', { expiresIn: '4h' });
    res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', authenticateToken, async (req: any, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return res.status(400).json({ error: 'oldPassword and newPassword required' });
  const user = await prisma.user.findUnique({ where: { id: Number(req.user.id) } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) return res.status(401).json({ error: 'Old password incorrect' });
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
  res.json({ ok: true });
});

export default router;
