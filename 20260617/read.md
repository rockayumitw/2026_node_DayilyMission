# 🏅 Day 4 - Node.js 內建 http 模組

在前端時，我們是發送請求（Request）去跟別人要資料的人；到了後端，我們變成了接收請求並給予回應（Response） 的伺服器。

Node.js 內建的 http 模組，就是專門用來監聽網路協定（HTTP），並根據使用者的連線給予相對應的網頁內容或 JSON 資料。

### 常用語法

| 語法 | 說明 |
| --- | --- |
| `http.createServer(callback)` | 建立 server，每次收到請求就執行 callback |
| `req.method` | HTTP 方法（`'GET'`、`'POST'` 等） |
| `req.url` | 請求路徑（`'/'`、`'/coaches/avatar'` 等） |
| `res.writeHead(statusCode, headers)` | 設定狀態碼與 Header |
| `res.end(body)` | 送出回應並結束連線 |
| `server.listen(port, callback)` | 讓 server 開始監聽指定的 port |

### 核心觀念
要用 http 建立一個網路服務，主要有三個核心步驟：

1. createServer：建立一個伺服器實例。
2. 處理 req 與 res：
    - req：請求物件，裡面裝著使用者傳過來的資訊（例如他去了哪個網址、用什麼瀏覽器）。
    - res：回應物件，我們要透過它把網頁內容或資料「寫（write）」回去給瀏覽器，並用「結束（end）」來完成回應。
3. listen：指定一個 Port 號，讓伺服器開始在背景監聽，等待連線。
> **Port 是什麼？** Port（埠）是電腦上的「門牌號碼」，讓不同服務可以同時在同一台機器上運行而不互相干擾。例如 server 跑在 port 3000，瀏覽器就要連到 `http://localhost:3000` 才找得到它。


以下是基礎 HTTP 伺服器的標準寫法：
```javascript=
const http = require('http');

// 1. 建立伺服器，傳入一個 Callback 函式處理每一次的連線
const server = http.createServer((req, res) => {
  
  // 設定 HTTP 回傳狀態碼為 200 (成功)，並指定回傳內容是純文字或 HTML
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  
  // 寫入要丟回給瀏覽器的內容
  res.write('<h1>哈囉！你成功連線到我的伺服器了(｡･∀･)ﾉﾞ</h1>');
  
  // 必須呼叫 end()，否則瀏覽器會認為資料還沒傳完，網頁會一直轉圈圈卡死
  res.end();
});

// 2. 讓伺服器監聽 3000 Port
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`[系統] 伺服器已啟動！請打開瀏覽器輸入：http://localhost:${PORT}`);
});
```

## 題目
請於本地端建立一個 app.js 檔案。啟動伺服器後，請打開瀏覽器確認畫面，並在完成後合併為一份 CodePen 繳交，若有問答題則透過「註解」進行回答。

> 情境：
> 請利用 Node.js 內建的 http 模組建立一個簡單的伺服器。這次我們要挑戰結合前一天學到的環境變數（.env）觀念，讓伺服器去讀取設定的 Port 號。

任務要求：
1. 建立 .env 檔案：
    - 設定變數 PORT 為 4000。
2. 建立 app.js (主程式)：
    - 引入 `dotenv` 與內建的 http 模組。
    - 宣告 `serverPort` 變數去讀取環境變數的 PORT，若環境變數不存在，則預設值為 3000。
    - 使用 `http.createServer` 建立伺服器：
        - 回傳狀態碼設定為 200。
        - Header 的 Content-Type 請設定為網頁格式並支援中文（`text/html; charset=utf-8`）。
        - 網頁內容請輸出：`「<h2>歡迎來到我的第一個 Node.js 網站！</h2>」`。
    - 讓伺服器成功監聽讀取到的 Port 號，並在終端機印出啟動提示。


::: spoiler 點擊即可觀看解答
```javascript=
// .env

PORT=4000


// app.js

const dotenv = require('dotenv');
dotenv.config();
const http = require('http');

// 1. 讀取環境變數，並加上防呆預設值
const serverPort = process.env.PORT || 3000;

// 2. 建立 HTTP 伺服器
const server = http.createServer((req, res) => {
  // 設定狀態碼與響應標頭（確保中文不亂碼）
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  
  // 輸出網頁內容
  res.write('<h2>歡迎來到我的第一個 Node.js 網站！</h2>');
  
  // 結束響應，將資料送出
  res.end();
});

// 3. 監聽指定埠號
server.listen(serverPort, () => {
  console.log(`[系統] 伺服器運行中！網址為：http://localhost:${serverPort}`);
});
```
:::