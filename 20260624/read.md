---
title: 🏅 Day 9 - Middleware 概念與應用
tags: 後端 Node.js 直播班 | 2026
---

# 🏅 Day 9 - Middleware 概念與應用
在前幾天的練習中，每條路由都是直接處理請求並送出回應。但在實際開發中，有很多工作需要在「收到請求」與「執行路由邏輯」之間先做處理，例如：解析請求格式、驗證身份、記錄 Log 等。這些夾在中間執行的函式，就叫做 **Middleware（中介軟體）**。

### **什麼是 Middleware？**
Middleware 是一個接收 `(req, res, next)` 三個參數的函式，Express 會依照掛載順序依序執行每一層 Middleware。每層處理完後，必須呼叫 `next()` 將控制權交給下一層；如果沒呼叫，請求就會卡在那層一直沒有回應。

```
請求進入
   ↓
[Middleware 1]  → next()
   ↓
[Middleware 2]  → next()
   ↓
[路由 handler]  → res.json() 送出回應
```

```javascript=
// 一個簡單的自訂 Middleware
const logMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // 一定要呼叫，否則請求會卡住
};

// 用 app.use() 掛載，讓所有路由都會經過它
app.use(logMiddleware);
```

### **app.use() 用法**

`app.use()` 是掛載 Middleware 的標準方式，可以選擇掛在全域（所有路由）或指定路徑前綴：
```javascript=
// 全域掛載：所有請求都會經過
app.use(middlewareA);

// 指定路徑前綴：只有 /api 開頭的請求才會經過
app.use('/api', middlewareB);
```

### **常見的 Middleware**

**1. express.json() — 解析 JSON 請求內容**

當前端以 `POST` 或 `PUT` 送出 JSON 格式的資料時，Express 預設不會自動解析，`req.body` 會是 `undefined`。掛上 `express.json()` 後，Express 才會將請求的 JSON 字串解析成 JavaScript 物件放入 `req.body`。
```javascript=
app.use(express.json()); // 掛載後，req.body 才能正確取得資料

app.post('/members', (req, res) => {
  console.log(req.body); // { name: '王小明', age: 28 }
  res.status(201).json({ status: 'success', data: req.body });
});
```
若沒有掛載 express.json()，即使前端有送資料，req.body 也會是 undefined，導致資料遺失。

**2. cors() — 解決跨域問題**

瀏覽器基於安全性有「[同源政策（Same-Origin Policy）](https://developer.mozilla.org/zh-TW/docs/Web/Security/Defenses/Same-origin_policy)」的限制，當前端（例如 `http://localhost:5173`）呼叫不同來源的後端（例如 `http://localhost:3000`）時，瀏覽器會自動擋掉這個請求，這就是「跨域（CORS）」問題。

這邊我們會使用第三方套件 [cors](https://www.npmjs.com/package/cors) 來解決跨域問題，安裝並掛載套件後，後端會在回應中加上正確的 HTTP Header，告訴瀏覽器「這個請求我允許」，跨域問題就解決了。
```javascript=
const cors = require('cors');

app.use(cors()); // 預設允許所有來源，開發階段使用
```

### **掛載順序的重要性**
Middleware 的執行順序與程式碼的撰寫順序完全一致，**掛載順序會直接影響行為**。
因此務必在路由定義前先掛好需要的 Middleware，否則路由執行時會取不到它處理好的資料。

```javascript=
const express = require('express');
const cors = require('cors');
const app = express();

// 先掛 Middleware，再定義路由
app.use(cors());
app.use(express.json());

app.post('/members', (req, res) => {
  // cors() 已生效 → 不會被瀏覽器擋
  // express.json() 已生效 → req.body 有資料
  res.status(201).json({ status: 'success', data: req.body });
});
```

## **題目**

請於本地端建立一個 app.js 檔案撰寫，並在完成後合併為一份 CodePen 繳交，若有問答題則透過「註解」進行回答。

> 情境：
> 健身房系統的 API 需要支援跨域請求，並且要能正確接收前端送來的 JSON 資料。請依正確順序掛載 Middleware，並完成一支能新增會員的 POST 路由。

任務要求：

1. 安裝並引入 `express` 與 `cors` 套件。
2. 依照正確順序掛載以下兩個 Middleware：
    - `cors()`：解決跨域問題
    - `express.json()`：解析請求內容，確保 `req.body` 能正確取得資料
3. 建立 `GET /` 路由，回傳狀態碼 **200** 與：`{ "status": "success", "message": "API 運作中" }`
4. 建立 `POST /members` 路由，從 `req.body` 取出 `name` 欄位，回傳狀態碼 **201** 與：`{ "status": "success", "data": { "name": "取出的 name 值" } }`
5. 監聽 **3000 Port**。

初始程式碼
```javascript=
// app.js
const express = require('express');
const cors = require('cors');
const app = express();

// === 請依正確順序掛載 Middleware ===


// ==================================

// GET /
app.get('/', (req, res) => {
  // === 請在此處撰寫你的程式碼 ===

  // ============================
});

// POST /members
app.post('/members', (req, res) => {
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
const express = require('express');
const cors = require('cors');
const app = express();

// 依正確順序掛載 Middleware
app.use(cors());
app.use(express.json());

// GET /
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API 運作中' });
});

// POST /members
app.post('/members', (req, res) => {
  const { name } = req.body;
  res.status(201).json({ status: 'success', data: { name } });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器啟動中：http://localhost:${PORT}`);
});
```

:::