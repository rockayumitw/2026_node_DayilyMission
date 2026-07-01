import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import * as jwt from 'jsonwebtoken'
import authMiddleware from './middleware/auth'

const { sign } = ((jwt as any).default || jwt) as any


const app = express();
app.use(cors());
app.use(express.json());
const SECRET = process.env.JWT_SECRET;


// POST /login（公開路由）
app.post('/login', (req, res) => {
  const token = sign(
    { userId: 1, email: 'member@gym.com' },
    SECRET,
    { expiresIn: '7d' }
  );
  res.status(200).json({ status: 'success', token });
});

// GET /profile（受保護路由）
app.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({ status: 'success', data: req.user });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器啟動中：http://localhost:${PORT}`);
});