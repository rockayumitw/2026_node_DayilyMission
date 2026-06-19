# 🏅 Day 6 - 路由設計

當我們在瀏覽器輸入不同路徑時，後端必須根據對應路徑與請求方法做出不同回應，這個機制就是路由（Routing），也是後端開發的核心概念之一，今天我們會先練習如何使用原生 Node.js 來設計路由，後續課程會再教到進階的 express 框架寫法唷。

### 常用語法

| 語法 | 說明 |
| --- | --- |
| `req.method` | HTTP 方法，如 `'GET'`、`'POST'` |
| `req.url` | 請求路徑，如 `'/coaches/avatar'` |

### 核心觀念
在原生 Node.js 的 `http.createServer` 中，我們主要依賴 req 物件裡的兩個屬性來做判斷：
1. `req.method`：撈出使用者請求的方法。
2. `req.url`：撈出使用者請求的網址路徑。

我們可以使用簡單的 `if...else` 或 `switch` 陳述式，把不同網址的請求導向對應的處理邏輯。
另外，記得要補上 404 狀態碼防呆，避免使用者輸入未定義的網址導致錯誤。

> **注意：** 每個分支都必須呼叫 `res.end()`，否則客戶端會一直等待沒有回應。建議把各路徑的處理邏輯拆成獨立的 handler 函式，讓 router 只負責「分派」，不負責「細節處理」。


### 使用範例
以下是「首頁」與「教練列表」兩個路由，並加上 404 防呆的標準寫法：
```javascript=
const http = require('http');

const server = http.createServer((req, res) => {
  // 1. 路由：首頁 (GET /)
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>歡迎來到健身房首頁！</h1>');
    return; // 記得 return，否則程式會繼續往下跑
  }

  // 2. 路由：取得教練列表 (GET /coaches)
  if (req.method === 'GET' && req.url === '/coaches') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    // 後端回傳 JSON 資料時，必須先用 JSON.stringify 轉為字串
    const coaches = [{ name: 'Alex' }, { name: 'John' }];
    res.end(JSON.stringify(coaches));
    return;
  }

  // 3. 404 防呆：當以上路由都不符合時
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('找不到此網頁（404 Not Found）');
});

server.listen(3000, () => console.log('伺服器執行中：http://localhost:3000'));
```

## 題目
請於本地端建立一個 app.js 檔案撰寫。並在完成後合併為一份 CodePen 繳交，若有問答題則透過「註解」進行回答。

> 情境：
> 你正在開發健身房系統的基礎 API 路由，請利用 Node.js 內建的 http 模組，根據不同的請求給予相對應的回應。

任務要求：
1. 使用 `http.createServer` 建立伺服器，監聽 3000 Port。
2. 請在 app.js 中設計出以下 3 種路由情境判斷：
    - 情境一：當收到 GET 請求且路徑為 `/` 時，回傳狀態碼 200，網頁內容印出純文字：`「歡迎來到健身房系統」`。
    - 情境二：當收到 GET 請求且路徑為 `/api/v1/packages` 時，回傳狀態碼 200，並以 JSON 格式 回傳以下軟體包資料（物件內容請參考初始碼）：
        ```json=
        { "status": "success", "data": "方案列表" }
        ```
    - 情境三：當使用者輸入上述以外的任何路徑時（例如：`/hello`），回傳狀態碼 404，印出純文字：「路由不存在」。

初始程式碼
```javascript=
// app.js
const http = require('http');

const server = http.createServer((req, res) => {
  // === 請在此處撰寫你的路由判斷程式碼 ===
  
  
  // ==================================
});

// 監聽 3000 port
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

::: spoiler 點擊即可觀看解答
```javascript=
const http = require('http');

const server = http.createServer((req, res) => {
  
  // 1. 處理首頁 GET /
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('歡迎來到健身房系統');
    return;
  }

  // 2. 處理 API 方案 GET /api/v1/packages
  if (req.method === 'GET' && req.url === '/api/v1/packages') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    
    const responseData = {
      status: 'success',
      data: '方案列表'
    };
    
    // 記得將物件轉為 JSON 字串再送出
    res.end(JSON.stringify(responseData));
    return;
  }

  // 3. 404 防呆
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('路由不存在');
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```
:::