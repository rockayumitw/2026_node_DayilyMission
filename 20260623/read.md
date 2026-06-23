---
title: 🏅 Day 8 - 網址規則、req.params 與 req.query
tags: 後端 Node.js 直播班 | 2026
---

# 🏅 Day 8 - 網址規則、req.params 與 req.query

在前一天的練習中，我們的路由路徑都是固定的，例如 `/api/v1/members`。但實際開發時，我們常常需要處理像 `/members/42` 這種「路徑中夾帶資料」的請求，或是 `/members?role=coach&limit=10` 這種「帶有篩選條件」的請求。
要正確取出這些資料，我們就需要先了解一條 URL 是如何組成的。

### URL 的組成結構
以 `https://www.google.com/search?q=hello` 為例，一條完整的 URL 可以拆解成以下幾個部分：

| **組成** | **範例** | **說明** |
| --- | --- | --- |
| 傳輸協定（Protocol） | `http://` `https://` | HTTPS 是加密版本（使用 SSL/TLS），現代網站幾乎全面採用加密版本；開發時常用 `localhost` 或 `127.0.0.1` 代表本機伺服器。 |
| 子網域（Subdomain） | `www` | 最常見的子網域，也可自訂為 `api.`、`blog.`、`app.` 來區分不同服務 |
| 網域（Domain） | `google.com` | 主網域，透過 DNS 解析對應到實際的伺服器 IP；開發時以 `localhost` 代替 |
| 埠號（Port） | 省略（預設 443） | 連接伺服器時使用的「門牌號碼」，讓不同服務可以在同一台機器上同時運行。HTTPS 預設 443、HTTP 預設 80，預設埠號在網址列會自動隱藏，所以範例網址看不到它。開發時因為跑在非標準埠，網址會明確顯示，例如 `http://localhost:3000` |
| 路徑（Path） | `/search` | 指定要存取的資源，後端的路由就是根據這段路徑決定執行哪段程式碼 |
| 查詢參數（Query String） | `?q=hello` | `?` 之後的部分，格式為 `key=value`，多個參數用 `&` 串接，例如 `?q=hello&lang=zh` |

### **req.params — 路徑參數**

當路由路徑中需要帶入**動態值**（例如：會員 ID、文章編號），我們會在路徑中加上 `:參數名稱` 的佔位符，Express 會自動解析並放入 `req.params` 物件中。
```javascript=
// 路徑中的 :id 是動態佔位符
app.get('/members/:id', (req, res) => {
  const memberId = req.params.id; // 取出路徑中的動態值

  res.status(200).json({ status: 'success', data: { id: memberId } });
});

// 請求 GET /members/42  → req.params.id 為 '42'
// 請求 GET /members/abc → req.params.id 為 'abc'
```

也可以同時有多個動態段落：
```javascript=
app.get('/coaches/:coachId/courses/:courseId', (req, res) => {
  const { coachId, courseId } = req.params; // 解構取出多個參數
  res.status(200).json({ coachId, courseId });
});

// 請求 GET /coaches/3/courses/7 → coachId: '3'、courseId: '7'
```

### **req.query — 查詢字串參數**

URL `?` 後面的查詢字串常用來傳遞**篩選條件、排序、分頁**等非必要資訊。Express 會自動解析並放入 `req.query` 物件中。

```javascript=
app.get('/members', (req, res) => {
  const role  = req.query.role;   // 取出 role 參數
  const limit = req.query.limit;  // 取出 limit 參數

  res.status(200).json({ status: 'success', filter: { role, limit } });
});

// 請求 GET /members?role=coach&limit=10
// → req.query.role  = 'coach'
// → req.query.limit = '10'
```

> **小提醒：** `req.query` 取出的值一律是**字串**，若要做數字運算，記得先用 `Number()` 轉型。

### **RESTful 設計原則**

RESTful 是一種 API 路由的設計風格，核心概念是「**用 URL 表示資源，用 HTTP 方法表示動作**」，讓 API 的語意更直覺、更一致。

以「會員」資源為例，RESTful 的路由設計如下：

| **HTTP 方法** | **路徑** | **用途** |
| --- | --- | --- |
| `GET` | `/members` | 取得所有會員列表 |
| `GET` | `/members/:id` | 取得單一會員資料 |
| `POST` | `/members` | 新增一位會員 |
| `PUT` | `/members/:id` | 更新指定會員的完整資料 |
| `DELETE` | `/members/:id` | 刪除指定會員 |

> **小提醒：** URL 只放名詞（資源），動作由 HTTP 方法表達。請避免寫出 `/getMembers`、`/deleteUser/3` 這類把動作寫到路徑的方式。

### **常用 HTTP 狀態碼**

後端回應請求時，狀態碼是用來告訴前端「請求結果」的標準語言：

| **狀態碼** | **名稱** | **使用時機** |
| --- | --- | --- |
| `200` | OK | 請求成功，有回傳資料（GET、PUT） |
| `201` | Created | 資源建立成功（POST 新增後回傳） |
| `204` | No Content | 請求成功但無回傳內容（常用於 DELETE 成功後） |
| `400` | Bad Request | 請求格式錯誤或缺少必要參數 |
| `404` | Not Found | 找不到指定的資源 |

範例：
```javascript=
// 新增成功 → 201
app.post('/members', (req, res) => {
  res.status(201).json({ status: 'success', message: '會員新增成功' });
});

// 找不到資源 → 404
app.get('/members/:id', (req, res) => {
  const member = null; // 假設查無此人
  if (!member) {
    return res.status(404).json({ status: 'error', message: '找不到此會員' });
  }
});

// 刪除成功 → 204（不回傳任何內容）
app.delete('/members/:id', (req, res) => {
  res.status(204).end();
});
```

## **題目**

請於本地端建立一個 app.js 檔案撰寫，並在完成後合併為一份 CodePen 繳交，若有問答題則透過「註解」進行回答。

> 情境：
> 健身房系統需要提供「查詢教練資料」與「篩選課程列表」兩支 API。請根據 RESTful 設計原則與正確的狀態碼，設計以下路由，並正確使用 `req.params` 與 `req.query` 取出資料。
> 

任務要求：

1. 安裝並引入 `express`，建立應用程式實例，監聽 **3000 Port**。
2. 設計以下 2 條路由：
    - 路由一：`GET /coaches/:id`，從路徑中取出教練 ID，回傳狀態碼 **200** 與：`{ "status": "success", "coachId": "取出的 id 值" }`
    - 路由二：`GET /courses`，從查詢字串取出 `type` 與 `limit` 兩個參數，回傳狀態碼 **200** 與：`{ "status": "success", "filter": { "type": "取出的 type 值", "limit": "取出的 limit 值" } }`

初始程式碼
```javascript=
// app.js
const express = require('express');
const app = express();

// 路由一：取得單一教練資料
app.get('/coaches/:id', (req, res) => {
  // === 請在此處撰寫你的程式碼 ===

  // ============================
});

// 路由二：篩選課程列表
app.get('/courses', (req, res) => {
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
const app = express();

// 路由一：取得單一教練資料
app.get('/coaches/:id', (req, res) => {
  const coachId = req.params.id;
  res.status(200).json({ status: 'success', coachId });
});

// 路由二：篩選課程列表
app.get('/courses', (req, res) => {
  const { type, limit } = req.query;
  res.status(200).json({ status: 'success', filter: { type, limit } });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器啟動中：http://localhost:${PORT}`);
});
```

:::