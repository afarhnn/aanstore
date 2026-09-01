import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateToken(req: any, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'changeme') as any;
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
