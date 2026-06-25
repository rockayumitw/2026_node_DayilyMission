import express from 'express'
import type { Request, Response } from 'express'

const router = express.Router()


router.get('/', (req:Request, res:Response) => {
    res.status(200).json({
        status: 'success',
        message: 'all list'
    })
})

router.get('/:id', (req:Request, res: Response) => {
    const {id} = req.params
    res.status(200).json({
        status: 'success',
        memberId: id
    })
})

export default router