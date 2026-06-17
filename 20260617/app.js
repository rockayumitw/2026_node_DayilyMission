const dotenv = require('dotenv');
dotenv.config();
const http = require('http');

// 1. 讀取環境變數，並加上防呆預設值
const serverPort = process.env.PORT || 3000;

// 2. 建立 HTTP 伺服器
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.write('<h2>歡迎來到我的第一個 Node.js 網站！</h2>');
  res.end();
});

// 3. 監聽指定埠號
server.listen(serverPort, () => {
  console.log(`server on！ url：http://localhost:${serverPort}`);
});