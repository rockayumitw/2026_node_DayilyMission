import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'

const app = express()

type Param = {
    req: Request,
    res: Response
}

// 攔截
app.use(cors())
app.use(express.json()) // 建議也加上，用來解析 JSON 請求

// 路由
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'hello API now'
    })
})

app.get('/api/v1/members', (req:Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        data: [{ name: '王小明' }, { name: '李小花' }]
    });
})

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: '路由不存在' });
});


// 設定路由並啟動
const PORT = 3000
app.listen(PORT, () => {
    console.log(`server run: http://localhost:${PORT}`)
})