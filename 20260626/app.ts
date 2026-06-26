import express from 'express'
import cors from 'cors'
import router from './routes/member';

const app = express()

app.use(cors())
app.use(express.json())
app.use('/members', router)

const PORT = 3000
app.listen(PORT, () => {
    console.log(`server run: http://localhost:${PORT}`)
})