import express from 'express'
import cors from 'cors'
import memberRouter from './routes/member.js'

const app = express()


// 攔截
app.use(cors())
app.use(express.json())

// 路由
app.use('/members', memberRouter)

// 啟動
const PORT = 3000
app.listen(PORT, () => {
    console.log(`server run: http://localhost:${PORT}`)
})
