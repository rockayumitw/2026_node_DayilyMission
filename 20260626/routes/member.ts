import type { Member } from '../types'
import express from 'express'
import type { Request, Response } from 'express'

const router = express.Router();

let nextId = 3;

let members: Member[] = [
    { id: 1, name: '王小明' },
    { id: 2, name: '李小花' }
]

const findById = (list: any, id:string ) => {
    return list.find((item: any) => item.id === Number(id))
}

const validateFields = (body: Member, requiredFields: (keyof Member)[]): (keyof Member)[] => {
    // 修正語法：幫參數加上括號 (field)
    return requiredFields.filter((field) => !body[field]);
}

// 取得列表
router.get('/', (req: Request, res) => { 
    res.status(200).json({
        status: 'success',
        content: members
    })
});

// 新增
router.post('/', (req, res) => {
    const fields = validateFields(req.body, ['name'])
    if (fields.length > 0) {
        return res.status(400).json({
            status: 'error',
            content: `缺少欄位${fields.join(', ')}`
        })
    }
    const newMember = { id: nextId++, name: req.body.name };
    members.push(newMember);
    res.status(201).json({ status: 'success', data: newMember });
});

// 編輯
router.put('/:id', (req, res) => { 
    const member = findById(members, req.params.id)
    if (!member) return res.status(404).json({
        status: 'error',
        content: '沒有此筆資料'
    })
    const fields = validateFields(req.body, ['name'])
    if (fields.length > 0) {
        return res.status(400).json({
            stastus: 'error',
            content: `缺少必填欄位：${fields.join(', ')}`
        })
    }
    member.name = req.body.name
    res.status(200).json({ status: 'success', data: member });
});

// 刪除
router.delete('/:id', (req, res) => { 
    const idx = members.findIndex(item => item.id === Number(req.params.id))
    if (idx === -1) {
        return res.status(404).json({ status: 'error', content: '找不到此會員' });
    }
    members.splice(idx, 1)
    res.status(204).end()
});


export default router