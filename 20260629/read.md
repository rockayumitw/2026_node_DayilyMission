---
title: 🏅 Day 12 - 密碼安全與 bcrypt
tags: 後端 Node.js 直播班 | 2026
---

# 🏅 Day 12 - 密碼安全與 bcrypt
在 Day 11 的 CRUD 實作中，我們直接把使用者資料存進陣列。然而在真實專案中，這些資料最終會存到資料庫，若其中包含密碼欄位，並且直接以明文儲存，一旦資料庫遭到入侵，駭客就能看到所有人的原始密碼，並拿去嘗試登入其他平台（因為很多人在不同網站使用相同密碼）。

解決方式是在儲存前先對密碼做 **雜湊（Hash）加鹽（Salt）** 處理，讓資料庫裡永遠不出現明文密碼。

### **雜湊（Hash）**

Hash 是一種**單向函式**，把任意長度的輸入轉換成固定長度的輸出，且無法從輸出反推原始輸入。它有以下幾個重要特性：

| **特性** | **說明** |
| --- | --- |
| 不可逆 | 無法從雜湊值反推原始密碼 |
| 固定長度輸出 | 無論輸入多長，輸出長度固定 |
| 雪崩效應 | 輸入只要有微小變動，輸出就會產生巨大差異 |
| 相同輸入相同輸出 | 相同密碼永遠產生相同雜湊值 |

最後一個特性會衍生一個問題：如果兩個用戶密碼相同，資料庫裡的雜湊值也會一模一樣。駭客可以預先建立「常見密碼 → 雜湊值」的對照表（[彩虹表](https://zh.wikipedia.org/zh-tw/%E5%BD%A9%E8%99%B9%E8%A1%A8)，Rainbow Table）來反查，讓雜湊保護失效。

### **加鹽（Salting）**

為了防止彩虹表攻擊，我們在每次雜湊前加入一段隨機產生的字串，稱為 **Salt（鹽）**。Salt 與密碼合併後再做雜湊，讓即使兩個用戶的密碼完全相同，最終存進資料庫的雜湊值也會截然不同。
```
使用者 A 密碼：hello123 + Salt: x7kQ → 雜湊值: $2b$10$abc...
使用者 B 密碼：hello123 + Salt: m3pL → 雜湊值: $2b$10$xyz...
```
Salt 本身會和雜湊值一起儲存，驗證密碼時可以取出重新計算比對。

### **bcrypt**

[bcrypt](https://www.npmjs.com/package/bcrypt) 是業界廣泛使用的密碼雜湊套件，已有 Java、Python、Ruby、Node.js 等各語言的實作版本。它內建自動加鹽，並提供 **cost factor（輪數）** 調整，輪數越高運算越慢，暴力破解的成本就越大。

bcrypt 提供三個核心方法：

| **方法** | **說明** |
| --- | --- |
| `bcrypt.genSalt(rounds)` | 產生 Salt，`rounds` 為計算輪數，預設建議 **10** |
| `bcrypt.hash(password, salt)` | 將密碼與 Salt 合併後做雜湊，回傳加密後的字串 |
| `bcrypt.compare(password, hash)` | 比對明文密碼與雜湊值是否相符，回傳布林值 |

### **使用範例**
```javascript=
const bcrypt = require('bcrypt');

async function main() {
  const password = 'myPassword123';

  // 1. 產生 Salt（rounds = 10）
  const salt = await bcrypt.genSalt(10);

  // 2. 將密碼加鹽雜湊後儲存（模擬存入資料庫）
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log('雜湊後的密碼：', hashedPassword);
  // 輸出範例：$2b$10$N9qo8uLOickgx2ZMRZoMye...

  // 3. 驗證密碼：比對明文與雜湊值
  const isMatch = await bcrypt.compare('myPassword123', hashedPassword);
  console.log('密碼比對結果：', isMatch); // true

  const isWrong = await bcrypt.compare('wrongPassword', hashedPassword);
  console.log('錯誤密碼比對：', isWrong); // false
}

main();
```

## **題目**

請於本地端建立一個 app.js 檔案撰寫，並在完成後合併為一份 CodePen 繳交，若有問答題則透過「註解」進行回答。

> 情境：
> 健身房系統要新增「會員註冊」功能，為了避免明文密碼直接存入資料庫，在儲存前必須先對密碼進行雜湊處理。登入時再使用 `bcrypt.compare` 比對，確認密碼是否正確。

任務要求：

1. 安裝並引入 `bcrypt`。
2. 建立 `hashPassword(password)` 函式：
    - 使用 `bcrypt.genSalt(10)` 產生 Salt。
    - 使用 `bcrypt.hash` 對密碼進行雜湊，並回傳雜湊後的結果。
3. 建立 `verifyPassword(password, hash)` 函式：
    - 使用 `bcrypt.compare` 比對密碼與雜湊值，並回傳比對結果（`true` / `false`）。
4. 在主程式依序執行：
    - 呼叫 `hashPassword('hello123')` 並印出雜湊結果。
    - 用正確密碼 `'hello123'` 呼叫 `verifyPassword`，印出比對結果。
    - 用錯誤密碼 `'wrongPass'` 呼叫 `verifyPassword`，印出比對結果。

初始程式碼
```javascript=
// app.js
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  // === 請在此處撰寫你的程式碼 ===

  // ============================
}

async function verifyPassword(password, hash) {
  // === 請在此處撰寫你的程式碼 ===

  // ============================
}

async function main() {
  const hashed = await hashPassword('hello123');
  console.log('雜湊結果：', hashed);

  const correct = await verifyPassword('hello123', hashed);
  console.log('正確密碼比對：', correct);

  const wrong = await verifyPassword('wrongPass', hashed);
  console.log('錯誤密碼比對：', wrong);
}

main();
```

::: spoiler 點擊即可觀看解答
```javascript=
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}

async function verifyPassword(password, hash) {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
}

async function main() {
  const hashed = await hashPassword('hello123');
  console.log('雜湊結果：', hashed);

  const correct = await verifyPassword('hello123', hashed);
  console.log('正確密碼比對：', correct);

  const wrong = await verifyPassword('wrongPass', hashed);
  console.log('錯誤密碼比對：', wrong);
}

main();
```

:::