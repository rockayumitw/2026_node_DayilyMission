import express from 'express'
import cors from 'cors'
import type { Request, Response, NextFunction } from 'express'

const app = express()

app.use(cors()); 
app.use(express.json());


let members = [
    {
        id: 1,
        name: 'user1'
    },
    {
        id: 2,
        name: 'user2'
    }
]

app.get('/members', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        data: members
    })
})

app.get('/error-test', (req: Request, res: Response, next) => {
    next('這是一個錯誤測試')
})

// 404
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: '路由不存在' });
});

// 錯誤處理 Middleware（四個參數）
app.use((err:any, req: Request, res: Response, next:NextFunction) => {
  res.status(500).json({ status: 'error', message: err.message });
});

const PORT = 3000
app.listen(PORT, () => {
    console.log(`server on: http://localhost:${PORT}`)
})

