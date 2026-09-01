import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth';
import productsRouter from './routes/products';
import usersRouter from './routes/users';
import unitsRouter from './routes/units';
import { authenticateToken } from './middleware/auth';
import salesRouter from './routes/sales';
import purchasesRouter from './routes/purchases';
import stockRouter from './routes/stock';
import cashbookRouter from './routes/cashbook';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

const swaggerDocument = YAML.load('./docs/openapi.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

app.use('/api/auth', authRouter);
app.use('/api/products', authenticateToken, productsRouter);
app.use('/api/users', authenticateToken, usersRouter);
app.use('/api/units', authenticateToken, unitsRouter);
app.use('/api/sales', authenticateToken, salesRouter);
app.use('/api/purchases', authenticateToken, purchasesRouter);
app.use('/api/stock', authenticateToken, stockRouter);
app.use('/api/cashbook', authenticateToken, cashbookRouter);

// simple protected route example
app.get('/api/me', authenticateToken, async (req: any, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  res.json({ user: { id: user?.id, email: user?.email, name: user?.name, role: user?.role } });
});

// error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
