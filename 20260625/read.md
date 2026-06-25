---
title: 🏅 Day 10 - Router 拆分與模組化
tags: 後端 Node.js 直播班 | 2026
---

# 🏅 Day 10 - Router 拆分與模組化
在前幾天的練習中，我們所有路由都直接寫在 `app.js` 裡。專案規模小的時候還好管理，但隨著 API 數量增加，`app.js` 會越來越臃腫，像是同時塞進「會員路由」、「教練路由」、「課程路由」的話，最終會變成一個難以維護的大檔案。

為了避免這個問題，我們可以利用 `express.Router()` 將路由拆分成獨立模組，讓每個檔案只負責自己的資源，這也是前面學過的單一職責原則，把概念運用到專案結構的方式哦！

### **為什麼要拆分路由？**

以下是一個路由全塞在 `app.js` 的反例，可以想像隨著功能增加它會變得多難維護：
```javascript=
// ❌ 所有路由都擠在 app.js（難以維護）
app.get('/members', ...);
app.post('/members', ...);
app.get('/members/:id', ...);
app.get('/coaches', ...);
app.post('/coaches', ...);
app.get('/coaches/:id', ...);
app.get('/courses', ...);
app.post('/courses', ...);
// ... 越來越多
```

拆分後，每個資源有自己的檔案，app.js 只負責掛載，結構一目了然：
```
project/
├── app.js              ← 只負責掛載路由與 Middleware
└── routes/
    ├── members.js      ← 所有 /members 相關路由
    ├── coaches.js      ← 所有 /coaches 相關路由
    └── courses.js      ← 所有 /courses 相關路由
```

### **express.Router() 用法**

`express.Router()` 會建立一個獨立的路由實例，用法與 `app` 幾乎相同，但它是可以被匯出、掛載到任意路徑前綴的模組。

**步驟一：建立路由檔案（routes/members.js）**
```javascript=
const express = require('express');
const router = express.Router(); // 建立路由實例

// 這裡的路徑是「掛載前綴銜接」的路徑
router.get('/', (req, res) => {
  res.status(200).json({ status: 'success', data: '所有會員' });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ status: 'success', data: `會員 ${id}` });
});

router.post('/', (req, res) => {
  const { name } = req.body;
  res.status(201).json({ status: 'success', data: { name } });
});

module.exports = router; // 匯出路由實例
```

**步驟二：在 app.js 掛載路由（指定路徑前綴）**
```javascript=
const express = require('express');
const cors = require('cors');
const membersRouter = require('./routes/members'); // 引入路由模組

const app = express();
app.use(cors());
app.use(express.json());

// 將 membersRouter 掛載到 /members 前綴
app.use('/members', membersRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器啟動中：http://localhost:${PORT}`);
});
```

### **路徑前綴合併規則**

掛載時指定的前綴會與 router 內部路徑自動合併，形成一個完整的 URL：

| **router 內部路徑** | **掛載前綴** | **實際對應 URL** |
| --- | --- | --- |
| `router.get('/')` | `/members` | `GET /members` |
| `router.get('/:id')` | `/members` | `GET /members/:id` |
| `router.post('/')` | `/members` | `POST /members` |
| `router.get('/')` | `/coaches` | `GET /coaches` |
| `router.get('/:id')` | `/coaches` | `GET /coaches/:id` |

這個設計的好處是：路由檔案本身不需要知道自己被掛在哪個前綴，如果日後要把 `/members` 改成 `/api/v1/members`，只需要改 `app.js` 裡那一行 `app.use('/members')`，路由檔案完全不用動。

## **題目**

請於本地端建立 `app.js` 與 `routes/members.js` 兩個檔案撰寫，並在完成後合併為一份 CodePen 繳交，若有問答題則透過「註解」進行回答。

> 情境：
> 健身房系統的 API 規模逐漸擴大，需要將路由從 app.js 拆分出來獨立管理。請使用 `express.Router()` 建立會員路由模組，並在 app.js 中正確掛載。
> 

任務要求：
1. 建立 `routes/members.js`，使用 `express.Router()` 設計以下兩條路由：
    - `GET /`：回傳狀態碼 **200** 與 `{ "status": "success", "message": "所有會員列表" }`
    - `GET /:id`：從路徑取出 `id`，回傳狀態碼 **200** 與 `{ "status": "success", "memberId": "取出的 id 值" }`
    - 最後使用 `module.exports` 將 router 匯出。
2. 建立 `app.js`，安裝並引入 `express`、`cors`，依正確順序掛載 Middleware，並將 `routes/members.js` 掛載到 `/members` 前綴，監聽 **3000 Port**。
3. 確認以下實際對應 URL 皆能正常回應：
    - `GET /members` → 回傳所有會員列表
    - `GET /members/5` → 回傳 `memberId: "5"`

初始程式碼
```javascript=
// routes/members.js
const express = require('express');
const router = express.Router();

// GET /
router.get('/', (req, res) => {
  // === 請在此處撰寫你的程式碼 ===

  // ============================
});

// GET /:id
router.get('/:id', (req, res) => {
  // === 請在此處撰寫你的程式碼 ===

  // ============================
});

// 匯出 router
// === 請在此處撰寫你的程式碼 ===

// ============================
```

```javascript=
// app.js
const express = require('express');
const cors = require('cors');
const app = express();

// === 請依正確順序掛載 Middleware ===


// ==================================

// === 掛載 members 路由（引入並指定前綴）===


// ==========================================

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

// GET /members
router.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: '所有會員列表' });
});

// GET /members/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ status: 'success', memberId: id });
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