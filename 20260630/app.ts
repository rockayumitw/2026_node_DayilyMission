import express from 'express'
import cors from 'cors'
import 'dotenv/config'
// 1. 先用 * as 把它當成一個大物件匯入（這能滿足 TypeScript 的型別檢查）
import * as jwt from 'jsonwebtoken'

// 2. 如果在執行期發現它其實是一個 CommonJS 模組，就手動把它們解構出來
const { sign } = ((jwt as any).default || jwt) as any

const app = express()

app.use(cors())
app.use(express.json())

type User = {
    id: number,
    email: string
}


const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
    throw new Error('未設定 JWT_SECRET 環境變數！');
}

const generateToken = (user: User) => sign(
    { userId: user.id, email: user.email },
    SECRET,
    { expiresIn: '7d' }
)

const token = generateToken({ id: 1, email: 'member@gym.com' })
console.log('簽發的 Token：', token);


const PORT = 3000
app.listen(PORT, () => {
    console.log(`server run: http://localhost:${PORT}`)
})