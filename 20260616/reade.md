# 🏅 Day 3 - process.env、.env、dotenv

在不同的環境下（例如：你自己的電腦、測試伺服器、正式上線的伺服器），我們通常需要使用不同的變數設定。
為了不讓程式碼因為換了環境就得手動修改，我們會把這些「會隨環境改變的變數」或「敏感機密資料」抽離到一個獨立的設定檔中，這就是環境變數的概念。

### 什麼是 process.env？
process 是 Node.js 內建的全域物件（不需要 import 就能用），它代表當前這個 Node.js 程式執行的「進程」。而 process.env 則是用來讀取這台電腦作業系統環境變數的屬性。

### 什麼是 .env 檔案？
我們通常不會每次執行程式，就去修改一次電腦作業系統的設定。因此，我們會在專案的根目錄建立一個純文字檔，檔名就叫做 .env。
裡面會以 KEY=VALUE （鍵值對）的格式來存放設定：
```javascript=
// .env 檔案
DEBUG_MODE=true
```
> 重要觀念：.env 檔案內含機密資料，所以絕對不能推上 GitHub！我們必須在 .gitignore 檔案中加入 .env，確保它被 Git 忽略。

### 為什麼需要 dotenv 套件？
Node.js 預設是讀不到 .env 檔案內容的。我們必須藉由第三方套件 [dotenv](https://www.npmjs.com/package/dotenv)，在程式啟動時自動讀取 .env 檔，並把裡面的內容放進 process.env 物件中。

> 補充：Node.js v20.6.0 之後有內建 `--env-file` 可以不需要 dotenv 直接讀取 .env，但考量業界的使用跟專案環境的靈活性，dotenv 是很常見的（課程也以 dotenv 為主）

## 題目
請於本地端建立一個全新的資料夾，撰寫 app.js 與 .env 兩個檔案，並在完成後合併為一份 CodePen 繳交，若有問答題則透過「註解」進行回答。

> 小提醒：從 .env 取出的內容一律都是「字串」！如果要做數學運算（例如算位元組 Bytes），記得要先轉型。此外，為了避免 .env 未取得變數的情況，我們常會用 || 來提供預設值。

任務要求：
1. 建立 .env 檔案：
    - 設定 `MAX_FILE_SIZE_MB` 為 10
    - 設定 `UPLOAD_DIR` 為 ./local_uploads
    - 設定 `GYM_NAME` 為 六角無限健身房
2. 建立 app.js (主程式)：
    - 正確引入並啟動 dotenv 套件。
    - 宣告並建立 `getUploadConfig()` 函式，使其回傳一個物件，物件內包含：
        - uploadDir：讀取環境變數 `UPLOAD_DIR`，若不存在則預設值為 '/tmp'。
        - maxFileSize：讀取環境變數 `MAX_FILE_SIZE_MB`，若不存在則預設值為 5。
        - gymName：讀取環境變數 `GYM_NAME`，若不存在則預設值為 '未命名健身房'。
    - 在主程式最後呼叫 `getUploadConfig()` 並用 console.log 印出完整回傳物件測試。
```javascript=
// app.js 結構參考
const dotenv = require('dotenv');
dotenv.config();

function getUploadConfig() {
  // 提示：用 || 給預設值；MAX_FILE_SIZE_MB 是字串，記得使用 Number() 轉型
  ...
  return {
    uploadDir: ...,
    maxFileSize: ...,
    gymName: ...
  };
}

// 測試印出
console.log(getUploadConfig());
```


::: spoiler 點擊即可觀看解答
```javascript=
// .env

MAX_FILE_SIZE_MB=10
UPLOAD_DIR=./local_uploads
GYM_NAME=六角無限健身房


// app.js

// 1. 引入並啟動環境變數套件
const dotenv = require('dotenv');
dotenv.config();

function getUploadConfig() {
  // 2. 將環境變數轉為數字，並給予預設值 5 (MB)
  const mbSize = Number(process.env.MAX_FILE_SIZE_MB) || 5;
  
  return {
    // 3. 使用 || 給予路徑預設值
    uploadDir: process.env.UPLOAD_DIR || '/tmp',
    
    // 4. 代入已轉型的 mbSize 環境變數
    maxFileSize: mbSize,
    
    // 5. 使用 || 給予健身房名稱預設值
    gymName: process.env.GYM_NAME || '未命名健身房',
  };
}

// 6. 執行測試
console.log('--- 健身房上傳配置測試 ---');
console.log(getUploadConfig());
```

:::