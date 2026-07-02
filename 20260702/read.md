---
title: 🏅 Day 15 - Middleware 三種類型
tags: 後端 Node.js 直播班 | 2026
---

# 🏅 Day 15 - Middleware 三種類型
在前幾天的練習中，我們已經練習運用過各種 Middleware。今天要來統整 Express 中三種 Middleware 的定義與差異，以及它們在 `app.js` 中應該如何排列，若順序錯了整個 API 的行為就會不如預期。

### **全域 Middleware**

透過 `app.use()` 掛載，**所有請求**都會經過，通常用來處理共用邏輯，例如：

```javascript=
app.use(cors());           // 解決跨域
app.use(express.json());   // 解析 JSON request body
app.use(logMiddleware);    // 自訂 Log 記錄
```

### **路由層級 Middleware**

作為路由的第二個參數直接掛在**單一路由**上，只針對特定路由生效，例如前一天學的 `authMiddleware`：

```javascript=
app.get('/profile', authMiddleware, (req, res) => {
  res.json({ data: req.user });
});
```

### **錯誤處理 Middleware**

錯誤處理 Middleware 的特徵是**固定有四個參數** `(err, req, res, next)`，Express 只要看到函式有四個參數，就會把它識別為錯誤處理器。

觸發方式是在任意路由或 Middleware 中呼叫 `next(err)`，Express 就會跳過後續的一般路由，直接往下找第一個錯誤處理 Middleware 執行：

```javascript=
// 路由中發生錯誤，呼叫 next(err) 往下傳
app.get('/members/:id', (req, res, next) => {
  try {
    // 假設這裡操作資料庫發生錯誤
    throw new Error('資料庫連線失敗');
  } catch (err) {
    next(err); // 把錯誤丟給錯誤處理 Middleware
  }
});

// 錯誤處理 Middleware：固定四個參數，放在所有路由之後
app.use((err, req, res, next) => {
  console.error('[錯誤]', err.message);
  res.status(500).json({ status: 'error', message: err.message });
});
```

> **注意：** 四個參數缺一不可，若少寫一個，Express 就不會把它視為錯誤處理器，`next(err)` 傳來的錯誤就無法被攔截。

### **Middleware 擺放順序**

Express 會**由上到下依序執行**，因此擺放順序至關重要。標準的順序如下：

```javascript=
const app = express();

// 1. 全域 Middleware（最先執行，讓所有路由都能用到）
app.use(cors());
app.use(express.json());

// 2. 路由（處理實際業務邏輯）
app.use('/members', membersRouter);
app.use('/coaches', coachesRouter);

// 3. 404 catch-all（所有路由都不符合時才會到這裡）
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: '路由不存在' });
});

// 4. 錯誤處理 Middleware（四個參數，放在最後）
app.use((err, req, res, next) => {
  res.status(500).json({ status: 'error', message: err.message });
});
```

**為什麼 404 要放在路由之後？**
因為 Express 是逐行往下配對的，只有當**所有路由都不符合**請求路徑時，才會繼續往下執行到 404 這層。若把 404 放在路由之前，所有請求都會直接被它攔截，永遠進不到任何路由。

## **題目**

請於本地端建立一個 `app.js` 檔案撰寫，並在完成後合併為一份 CodePen 繳交，若有問答題則透過「註解」進行回答。

> 情境：
> 健身房系統的 API 目前缺少統一的錯誤處理與 404 防呆。請依照正確順序建立完整的 Middleware 結構，並讓錯誤處理 Middleware 能正確攔截 `next(err)` 傳入的錯誤。

任務要求：

1. 安裝並引入 `express`、`cors`，掛載全域 Middleware。
2. 建立 `GET /members` 路由，直接回傳狀態碼 **200** 與 `{ "status": "success", "data": "會員列表" }`。
3. 建立 `GET /error-test` 路由，使用 `next(err)` 拋出一個 `new Error('這是一個測試錯誤')`，觸發錯誤處理 Middleware。
4. 依正確順序加入以下兩層：
    - **404 catch-all**：回傳狀態碼 **404** 與 `{ "status": "error", "message": "路由不存在" }`。
    - **錯誤處理 Middleware**：回傳狀態碼 **500** 與 `{ "status": "error", "message": "錯誤訊息內容" }`。

初始程式碼
```javascript=
// app.js
const express = require('express');
const cors = require('cors');
const app = express();

// 1. 全域 Middleware
app.use(cors());
app.use(express.json());

// 2. 路由
app.get('/members', (req, res) => {
  // === 請在此處撰寫你的程式碼 ===

  // ============================
});

app.get('/error-test', (req, res, next) => {
  // === 請在此處撰寫你的程式碼 ===

  // ============================
});

// 3. 404 catch-all
// === 請在此處撰寫你的程式碼 ===

// ============================

// 4. 錯誤處理 Middleware
// === 請在此處撰寫你的程式碼 ===

// ============================

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

// 1. 全域 Middleware
app.use(cors());
app.use(express.json());

// 2. 路由
app.get('/members', (req, res) => {
  res.status(200).json({ status: 'success', data: '會員列表' });
});

app.get('/error-test', (req, res, next) => {
  next(new Error('這是一個測試錯誤'));
});

// 3. 404 catch-all
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: '路由不存在' });
});

// 4. 錯誤處理 Middleware（四個參數）
app.use((err, req, res, next) => {
  res.status(500).json({ status: 'error', message: err.message });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器啟動中：http://localhost:${PORT}`);
});
```

:::