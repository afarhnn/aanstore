import { Request, Response, NextFunction } from 'express';

export function authorize(allowedRoles: string[]) {
  return (req: any, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (!allowedRoles.includes(user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
