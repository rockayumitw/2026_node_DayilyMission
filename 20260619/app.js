const http = require('http')

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        res.end('<h1>welcome 健身房</h1>')
        return
    }

    // 2. 路由：取得教練列表 (GET /coaches)
    if (req.method === 'GET' && req.url === '/coaches') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        // 後端回傳 JSON 資料時，必須先用 JSON.stringify 轉為字串
        const coaches = [{ name: 'Alex' }, { name: 'John' }];
        res.end(JSON.stringify(coaches));
        return;
    }

    if (req.method === 'GET' && req.url == '/aboutus') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        // 後端回傳 JSON 資料時，必須先用 JSON.stringify 轉為字串
        const aboutMsg = {
            "content": "hello this is about us"
        };
        res.end(JSON.stringify(aboutMsg));
        return;
    }

    // 3. 404 防呆：當以上路由都不符合時
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('找不到此網頁（404 Not Found）');
})

server.listen(3000, () => console.log('伺服器執行中：http://localhost:3000'));