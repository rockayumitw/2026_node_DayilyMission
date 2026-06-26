---
title: 🏅 Day 11 - CRUD 實作與資料驗證
tags: 後端 Node.js 直播班 | 2026
---

# 🏅 Day 11 - CRUD 實作與資料驗證
這週我們學會了 Express Router 拆分、Middleware 掛載、req.params / req.query 取值。今天要把這些概念整合起來，完整實作一份具備資料驗證的 CRUD API。

由於目前還沒有連接資料庫，我們會用 JavaScript 陣列存放資料，這種方式稱為 in-memory（記憶體內），伺服器重啟後資料會清空，適合學習階段練習邏輯使用。

以下將以 courses API 為例，示範 Helper 函式的設計跟 CRUD 實作。 同學可再參考這個範例的邏輯，來複習前幾天的概念，並且嘗試完成今天的題目 members API 唷。

### Helper 函式設計
可以先把篩選、驗證等重複邏輯抽成獨立函式，讓路由 handler 能夠保持簡潔：
```javascript=
// 以 id 搜尋資料，找不到回傳 undefined
function findById(list, id) {
  return list.find(item => item.id === Number(id));
}

// 驗證必填欄位是否齊全，回傳缺少的欄位陣列
function validateFields(body, requiredFields) {
  return requiredFields.filter(field => !body[field]);
}
```

### 完整 CRUD 範例
```javascript=
// routes/courses.js
const express = require('express');
const router = express.Router();

let courses = [
  { id: 1, name: '瑜伽入門', price: 1200 },
  { id: 2, name: '重訓基礎', price: 1500 },
];
let nextId = 3;

function findById(list, id) {
  return list.find(item => item.id === Number(id));
}

function validateFields(body, requiredFields) {
  return requiredFields.filter(field => !body[field]);
}

// GET /courses
router.get('/', (req, res) => {
  res.status(200).json({ status: 'success', data: courses });
});

// GET /courses/:id
router.get('/:id', (req, res) => {
  const course = findById(courses, req.params.id);
  if (!course) {
    return res.status(404).json({ status: 'error', message: '找不到此課程' });
  }
  res.status(200).json({ status: 'success', data: course });
});

// POST /courses
router.post('/', (req, res) => {
  const missingFields = validateFields(req.body, ['name', 'price']);
  if (missingFields.length > 0) {
    return res.status(400).json({ status: 'error', message: `缺少必填欄位：${missingFields.join(', ')}` });
  }

  const newCourse = { id: nextId++, name: req.body.name, price: req.body.price };
  courses.push(newCourse);
  res.status(201).json({ status: 'success', data: newCourse });
});

// PUT /courses/:id
router.put('/:id', (req, res) => {
  const course = findById(courses, req.params.id);
  if (!course) {
    return res.status(404).json({ status: 'error', message: '找不到此課程' });
  }

  const missingFields = validateFields(req.body, ['name', 'price']);
  if (missingFields.length > 0) {
    return res.status(400).json({ status: 'error', message: `缺少必填欄位：${missingFields.join(', ')}` });
  }

  course.name = req.body.name;
  course.price = req.body.price;
  res.status(200).json({ status: 'success', data: course });
});

// DELETE /courses/:id
router.delete('/:id', (req, res) => {
  const index = courses.findIndex(item => item.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ status: 'error', message: '找不到此課程' });
  }

  courses.splice(index, 1);
  res.status(204).end();
});

module.exports = router;
```

```javascript=
// app.js
const express = require('express');
const cors = require('cors');
const coursesRouter = require('./routes/courses');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/courses', coursesRouter);

app.listen(3000, () => console.log('伺服器啟動中：http://localhost:3000'));
```

## **題目**

請於本地端建立 `app.js` 與 `routes/members.js` 兩個檔案撰寫，並在完成後合併為一份 CodePen 繳交，若有問答題則透過「註解」進行回答。

> 情境： 
> 健身房系統需要一套完整的會員管理 API。請實作 in-memory 的會員 CRUD，並加入資料驗證確保新增或更新時 `name` 欄位不能為空。

任務要求：

1. 建立 `routes/members.js`，包含以下內容：
    - In-memory 陣列，預設兩筆資料：`{ id: 1, name: '王小明' }`、`{ id: 2, name: '李小花' }`
    - `findById` 與 `validateFields` 兩個 helper 函式
    - 四條路由（前綴由 `app.use('/members', ...)` 提供）：
        - `GET /`：回傳所有會員，狀態碼 **200**
        - `POST /`：必填欄位 `name`，成功回傳 **201**；欄位缺失回傳 **400**
        - `PUT /:id`：必填欄位 `name`，找不到回傳 **404**，欄位缺失回傳 **400**
        - `DELETE /:id`：成功回傳 **204**；找不到回傳 **404**
2. 建立 `app.js`，掛載 `cors()`、`express.json()`，將 members 路由掛載到 `/members`，監聽 **3000 Port**。

初始程式碼
```javascript=
// routes/members.js
const express = require('express');
const router = express.Router();

let members = [
  { id: 1, name: '王小明' },
  { id: 2, name: '李小花' },
];
let nextId = 3;

function findById(list, id) { ... }
function validateFields(body, requiredFields) { ... }

router.get('/', (req, res) => { ... });
router.post('/', (req, res) => { ... });
router.put('/:id', (req, res) => { ... });
router.delete('/:id', (req, res) => { ... });

module.exports = router;
```

```javascript=
// app.js
const express = require('express');
const cors = require('cors');
const app = express();

// 掛載 Middleware 與路由

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器啟動中：http://localhost:${PORT}`);
});
```

::: spoiler 點擊即可觀看解答
```javascript=
// routes/members.js
const express = require('express');
const router = express.Router();

let members = [
  { id: 1, name: '王小明' },
  { id: 2, name: '李小花' },
];
let nextId = 3;

function findById(list, id) {
  return list.find(item => item.id === Number(id));
}

function validateFields(body, requiredFields) {
  return requiredFields.filter(field => !body[field]);
}

router.get('/', (req, res) => {
  res.status(200).json({ status: 'success', data: members });
});

router.post('/', (req, res) => {
  const missingFields = validateFields(req.body, ['name']);
  if (missingFields.length > 0) {
    return res.status(400).json({ status: 'error', message: `缺少必填欄位：${missingFields.join(', ')}` });
  }
  const newMember = { id: nextId++, name: req.body.name };
  members.push(newMember);
  res.status(201).json({ status: 'success', data: newMember });
});

router.put('/:id', (req, res) => {
  const member = findById(members, req.params.id);
  if (!member) {
    return res.status(404).json({ status: 'error', message: '找不到此會員' });
  }
  const missingFields = validateFields(req.body, ['name']);
  if (missingFields.length > 0) {
    return res.status(400).json({ status: 'error', message: `缺少必填欄位：${missingFields.join(', ')}` });
  }
  member.name = req.body.name;
  res.status(200).json({ status: 'success', data: member });
});

router.delete('/:id', (req, res) => {
  const index = members.findIndex(item => item.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ status: 'error', message: '找不到此會員' });
  }
  members.splice(index, 1);
  res.status(204).end();
});

module.exports = router;
```

```javascript=
// app.js
const express = require('express');
const cors = require('cors');
const membersRouter = require('./routes/members');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/members', membersRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器啟動中：http://localhost:${PORT}`);
});
```

:::