---
title: 🏅 Day 14 - JWT 驗證與自訂 Middleware
tags: 後端 Node.js 直播班 | 2026
---

# 🏅 Day 14 - JWT 驗證與自訂 Middleware
前一天我們學會了用 jwt.sign 簽發 Token。但光有簽發還不夠，後端還需要在每次受保護的請求進來時，驗證 Token 是否合法，這就是我們今天的練習重點。

### **Bearer Token 格式**

前端拿到 Token 後，後續請求會把它放在 HTTP Header 的 `Authorization` 欄位，常見寫法為：
```
Authorization: Bearer <token>
```

`Bearer` 是 Token 類型的標準前綴，後端收到後需要先把 `Bearer` 這個前綴去掉，才能取得純粹的 Token 字串進行驗證。
```javascript=
// req.headers.authorization 的值長這樣：
// 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

const authHeader = req.headers.authorization;
const token = authHeader.split(' ')[1]; // 取 'Bearer ' 後面的部分
```

### **jwt.verify — 驗證 Token**

`jwt.verify(token, secret)` 會驗證 Token 的簽名與有效期限，驗證成功回傳 Payload 物件，失敗則拋出錯誤，因此需要搭配 `try...catch` 處理：

```javascript=
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

try {
  const decoded = jwt.verify(token, SECRET);
  console.log('驗證成功：', decoded);
  // decoded: { userId: 1, email: 'test@example.com', iat: ..., exp: ... }
} catch (err) {
  console.error('驗證失敗：', err.message);
  // Token 無效 → 'invalid signature'
  // Token 過期 → 'jwt expired'
}
```

### **自訂驗證 Middleware**

如果每條需要保護的路由都自己寫一次驗證邏輯，程式碼會充滿重複的 `try...catch`。更好的做法是把驗證邏輯抽成一個獨立的 Middleware，要保護哪條路由就把它掛上去，完全不用重複撰寫。

```javascript=
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  // 1. 取出 Header 裡的 Token
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: '未提供 Token' });
  }

  const token = authHeader.split(' ')[1];

  // 2. 驗證 Token
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // 將解碼後的使用者資訊掛到 req，供後續路由使用
    next();             // 驗證通過，交給下一層
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Token 無效或已過期' });
  }
}
```

> **重點：** Middleware 的最後必須呼叫 `next()`，否則請求會卡住無法繼續。若驗證失敗，則直接 `return res.status(401)` 結束，不呼叫 `next()`。

### **掛載到指定路由**

Middleware 可以作為第二個參數直接掛在單一路由上，只保護需要的路由，不影響公開路由：

```javascript=
const express = require('express');
const router = express.Router();

// 公開路由：不需要 Token
router.post('/login', (req, res) => {
  res.json({ status: 'success', message: '登入成功' });
});

// 受保護路由：掛上 authMiddleware，驗證通過才能進入 handler
router.get('/profile', authMiddleware, (req, res) => {
  // authMiddleware 驗證通過後，req.user 已有解碼資料可用
  res.status(200).json({ status: 'success', data: req.user });
});
```

## **題目**

請於本地端建立 `app.js`、`middleware/auth.js` 與 `.env` 三個檔案撰寫，並在完成後合併為一份 CodePen 繳交，若有問答題則透過「註解」進行回答。

> 情境：
> 健身房系統需要保護「取得個人資料」這支 API，只有攜帶合法 JWT Token 的請求才能取得資料。請實作驗證 Middleware 並掛載到指定路由上。

任務要求：

1. 建立 `.env`，設定 `JWT_SECRET`（與簽發時相同的字串）。
2. 建立 `middleware/auth.js`，實作 `authMiddleware`：
    - 從 `req.headers.authorization` 取出 Token，若不存在或格式不符，回傳 **401** 與錯誤訊息。
    - 使用 `jwt.verify` 驗證 Token，驗證成功將 decoded 資料掛到 `req.user` 並呼叫 `next()`。
    - 驗證失敗回傳 **401** 與錯誤訊息。
    - 使用 `module.exports` 匯出。
3. 建立 `app.js`：
    - 掛載 `cors()`、`express.json()`。
    - 建立 `POST /login` 公開路由：直接回傳狀態碼 **200** 與一組用 `jwt.sign` 簽發的 Token（payload 填入 `{ userId: 1, email: 'member@gym.com' }`，過期時間 `'7d'`）。
    - 建立 `GET /profile` 受保護路由：掛上 `authMiddleware`，驗證通過後回傳狀態碼 **200** 與 `req.user` 的內容。

初始程式碼
```javascript=
// middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  // === 請在此處撰寫你的程式碼 ===

  // ============================
}

module.exports = authMiddleware;
```

```javascript=
// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET;

// POST /login（公開路由）
app.post('/login', (req, res) => {
  // === 請在此處撰寫你的程式碼 ===

  // ============================
});

// GET /profile（受保護路由）
app.get('/profile', authMiddleware, (req, res) => {
  // === 請在此處撰寫你的程式碼 ===

  // ============================
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器啟動中：http://localhost:${PORT}`);
});
```

::: spoiler 點擊即可觀看解答
```javascript=
// middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: '未提供 Token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Token 無效或已過期' });
  }
}

module.exports = authMiddleware;
```

```javascript=
// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET;

// POST /login（公開路由）
app.post('/login', (req, res) => {
  const token = jwt.sign(
    { userId: 1, email: 'member@gym.com' },
    SECRET,
    { expiresIn: '7d' }
  );
  res.status(200).json({ status: 'success', token });
});

// GET /profile（受保護路由）
app.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({ status: 'success', data: req.user });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器啟動中：http://localhost:${PORT}`);
});
```

:::