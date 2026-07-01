---
title: 🏅 Day 13 - JWT 概念與簽發
tags: 後端 Node.js 直播班 | 2026
---

# 🏅 Day 13 - JWT 概念與簽發
在前一天我們學會了如何安全地儲存密碼。但當使用者成功登入後，伺服器要怎麼記住「這個請求是誰發的」？
傳統做法是把登入狀態存在伺服器的 Session 中，但這樣伺服器需要維護一份狀態，難以水平擴展。

**JWT（JSON Web Token）** 則是目前主流的無狀態驗證做法，伺服器不需要儲存任何登入狀態，只要驗證 Token 的簽名就能確認身份。

### **JWT 可以解決什麼問題？**
登入後，伺服器把使用者資訊簽發成一個 Token 交給前端。前端之後每次請求都帶上這個 Token，伺服器只需要驗證簽名是否合法，就能知道是誰在請求，完全不需要在伺服器端儲存任何狀態。
```
[登入流程]
前端送出帳密 → 後端驗證 → 簽發 JWT Token → 回傳給前端

[後續請求]
前端帶著 Token → 後端驗證 Token 簽名 → 確認身份 → 回傳資料
```

### **JWT 的三段結構**
一個 JWT 看起來像這樣，由兩個 `.` 分隔成三段，每段都是 Base64 編碼的字串：
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTcxNjAwMDAwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Header（標頭）**
說明這個 Token 的類型與簽名演算法：
```json=
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload（載荷）**
存放使用者資訊，可以自訂欄位。`iat`（issued at）是 JWT 自動加入的簽發時間戳記：
```json=
{
  "userId": 1,
  "email": "test@example.com",
  "iat": 1716000000
}
```
> **注意：** Payload 只是 Base64 編碼，並非加密，任何人都能解碼讀取內容。因此**不可以**在 Payload 裡放密碼、信用卡號等敏感資訊。

**Signature（簽名）**
將 Header 與 Payload 用 secret（金鑰）簽名，防止內容被竄改。只要有人修改了 Payload，簽名就會驗證失敗。secret 只存在伺服器端，絕對不能洩漏。
```
HMACSHA256(
  base64(Header) + "." + base64(Payload),
  secret
)
```

### **jwt.sign — 簽發 Token**
`jwt.sign(payload, secret, options)` 用來簽發 Token，三個參數分別為：

| **參數** | **說明** |
| --- | --- |
| `payload` | 要存入 Token 的資料物件 |
| `secret` | 伺服器端的金鑰，用來簽名與驗證 |
| `options` | 選填設定，常用 `expiresIn` 設定過期時間 |

```javascript=
const jwt = require('jsonwebtoken');

const SECRET = 'my-secret-key'; // 屬於機密資料，實務上應存放在 .env，不能寫死在程式碼裡

// 簽發 Token
const payload = { userId: 1, email: 'test@example.com' };
const token = jwt.sign(payload, SECRET, { expiresIn: '7d' }); // 7 天後過期

console.log('簽發的 Token：', token);
// 輸出：eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

`expiresIn` 支援多種格式：`'1h'`（1 小時）、`'7d'`（7 天）、`3600`（3600 秒）。

## **題目**

請於本地端建立 `app.js` 與 `.env` 兩個檔案撰寫，並在完成後合併為一份 CodePen 繳交，若有問答題則透過「註解」進行回答。

> 情境：
> 健身房系統的會員成功登入後，後端需要簽發一個 JWT Token 給前端，讓後續請求可以攜帶此 Token 進行身份驗證。
> 

任務要求：

1. 建立 `.env`，設定變數 `JWT_SECRET` 為任意字串（例如：`my-gym-secret`）。
2. 安裝並引入 `jsonwebtoken` 與 `dotenv`。
3. 建立 `generateToken(user)` 函式：
    - 從參數 `user` 物件中取出 `id` 與 `email`。
    - 使用 `jwt.sign` 將 `{ userId, email }` 簽發成 Token，secret 從 `process.env.JWT_SECRET` 讀取，過期時間設為 `'7d'`。
    - 回傳簽發好的 Token。
4. 在主程式呼叫 `generateToken({ id: 1, email: 'member@gym.com' })` 並印出 Token。

初始程式碼
```javascript=
// app.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

function generateToken(user) {
  // === 請在此處撰寫你的程式碼 ===

  // ============================
}

// 測試執行
const token = generateToken({ id: 1, email: 'member@gym.com' });
console.log('簽發的 Token：', token);
```

::: spoiler 點擊即可觀看解答
```javascript=
// .env
JWT_SECRET=my-gym-secret


// app.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

function generateToken(user) {
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    SECRET,
    { expiresIn: '7d' }
  );
  return token;
}

// 測試執行
const token = generateToken({ id: 1, email: 'member@gym.com' });
console.log('簽發的 Token：', token);
```

:::