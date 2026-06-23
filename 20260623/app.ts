import express from 'express'
import type { Request, Response } from 'express'


const app = express()

// 取得單筆教練資料
app.get('/coaches/:id', (req: Request<{ id: string }>, res: Response) => {
  const coachId = req.params.id;
  res.status(200).json({ 
    status: 'success', 
    coachId 
  });
});

// 取得篩選課程列表
app.get('/courses', (req: Request<{}, {}, {}, { type?: string; limit?: string }>, res: Response) => {
  const { type, limit } = req.query;
  res.status(200).json({ 
    status: 'success', 
    filter: { type, limit } 
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器啟動中：http://localhost:${PORT}`);
});