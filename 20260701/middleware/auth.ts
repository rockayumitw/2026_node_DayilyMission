import type { Request, Response} from 'express'
import * as jwt from 'jsonwebtoken'

const { verify } = ((jwt as any).default || jwt) as any
const SECRET = process.env.JWT_SECRET;

function authMiddleware(req: Request, res: Response, next: any) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: '未提供 Token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Token 無效或已過期' });
  }
}

export default authMiddleware