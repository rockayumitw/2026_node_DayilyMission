const express = require('express')
const app = express()


// 路由
const v = 'v1'
// 首頁
app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'getAPI' });
})

// 列表
app.get(`/api/${v}/list`, (req, res) => {
    res.status(200).json({
        status: 'success',
        data: [{ name: '王小明' }, { name: '李小花' }]
    });
})

// 404 
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: '路由不存在' });
});

// 掛載
const PORT = 3000
app.listen(PORT, () => {
    console.log(`run on server: http://localhost:${PORT}`)
})