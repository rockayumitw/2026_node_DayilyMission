---
title: 🏅 Day 7 - Express 框架入門
tags: 後端 Node.js 直播班 | 2026
---

# 🏅 Day 7 - Express 框架入門

在第二週我們用原生 http 模組建立伺服器，每次都得手動判斷 req.method 與 req.url，路由一多程式碼就會變得又長又亂。為了解決這個問題，我們通常會使用各種便利的框架來優化，今天要來介紹的就是 Express 框架。
Express 是目前 Node.js 生態中最主流的 Web 框架，它幫我們把這些重複的判斷邏輯封裝起來，讓路由寫法更直覺、更簡潔。

### Express 是什麼？
Express 是一款基於 Node.js 的輕量級 Web 框架，它的核心就是把原生 `http.createServer` 裡那一大堆 `if (req.method === 'GET' && req.url === '/')` 的判斷，改寫成更具語意化的形式。

以下對比兩種寫法，就能清楚感受到差異：
```javascript=
// 原生 http 寫法（需手動判斷）
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('首頁');
  }
});

// Express 寫法（語意清晰，直接對應 HTTP 方法）
const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('首頁');
});
```

### express() 與基本路由介紹
安裝 Express 後，第一步是呼叫 `express()` 建立應用程式實例（慣例命名為 app），接著透過 `app.方法(路徑, 處理函式)` 定義路由。

```javascript=
const express = require('express');
const app = express(); // 建立應用程式實例

// 基本路由寫法：app.HTTP方法(路徑, callback)
app.get('/members', (req, res) => { ... });   // 處理 GET 請求
app.post('/members', (req, res) => { ... });  // 處理 POST 請求
app.put('/members/:id', (req, res) => { ... }); // 處理 PUT 請求
app.delete('/members/:id', (req, res) => { ... }); // 處理 DELETE 請求

app.listen(3000, () => console.log('伺服器啟動中'));
```

### res 常用語法
Express 在原生的 res 物件上擴充了許多方便的語法：
| **語法** | **說明** |
| --- | --- |
| `res.send(內容)` | 送出純文字或 HTML，自動設定 Content-Type |
| `res.json(物件)` | 送出 JSON 格式，自動序列化物件並設定正確的 Content-Type |
| `res.status(狀態碼)` | 設定 HTTP 狀態碼，通常與其他方法串接使用 |
| `res.status(狀態碼).json(物件)` | 最常見的串接寫法，同時設定狀態碼與回傳 JSON |

```javascript=
// 回傳純文字
res.send('Hello');

// 回傳 JSON（不需要手動 JSON.stringify）
res.json({ status: 'success', data: [] });

// 搭配狀態碼回傳 JSON
res.status(201).json({ status: 'success', message: '建立成功' });
res.status(404).json({ status: 'error', message: '找不到資源' });
```

## **題目**

請於本地端建立一個 app.js 檔案撰寫，並在完成後合併為一份 CodePen 繳交，若有問答題則透過「註解」進行回答。

> 情境：
> 健身房系統要開始改用 Express 重寫 API。請利用 Express 建立一個伺服器，根據不同路徑回傳對應的 JSON 資料，並為每個路由設定正確的 HTTP 狀態碼。
> 

任務要求：
1. 安裝並引入 `express` 套件，建立 Express 應用程式實例，監聽 **3000 Port**。
2. 設計以下 3 條路由：
    - 路由一：`GET /`，回傳狀態碼 **200**，以 `res.json` 回傳：
        `{ "status": "success", "message": "歡迎來到健身房 API" }`
    - 路由二：`GET /api/v1/members`，回傳狀態碼 **200**，以 `res.json` 回傳：
        `{ "status": "success", "data": [{ "name": "王小明" }, { "name": "李小花" }] }`
    - 路由三：其他任何未定義路徑（使用 `app.use`），回傳狀態碼 **404**，以 `res.json` 回傳：
        `{ "status": "error", "message": "路由不存在" }`
> 備註：app.use 可匹配所有路徑與方法，如果放在最後是能作為 404 路由的處理；
> 這個部分後續講到 Middleware 時同學會更有概念，目前先知道有這樣的撰寫跟嘗試練習就可以囉～

初始程式碼
```javascript=
// app.js
const express = require('express');
const app = express();

// === 請在此處設計你的路由 ===


// ==========================

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器啟動中：http://localhost:${PORT}`);
});
```

::: spoiler 點擊即可觀看解答
```javascript=
const express = require('express');
const app = express();

// 路由一：首頁
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: '歡迎來到健身房 API' });
});

// 路由二：會員列表
app.get('/api/v1/members', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: [{ name: '王小明' }, { name: '李小花' }]
  });
});

// 路由三：404 防呆（app.use 會匹配所有未定義的路徑）
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: '路由不存在' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器啟動中：http://localhost:${PORT}`);
});
```

:::