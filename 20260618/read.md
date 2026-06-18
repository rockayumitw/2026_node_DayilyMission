# 🏅 Day 5 - formidable 與檔案上傳

當我們在網頁上填寫表單、上傳圖片時，瀏覽器會使用 `multipart/form-data` 格式來傳送檔案。
由於原生 Node.js 不會自動解析這種請求，我們通常會借用第三方套件 [formidable](https://www.npmjs.com/package/formidable) 來幫我們將檔案解析、儲存起來。

### 常用語法（v3 新版）

| 語法 | 說明 |
| --- | --- |
| `formidable({ uploadDir, maxFileSize, keepExtensions })` | 建立解析器 |
| `uploadDir` | 上傳的檔案要存到哪個目錄 |
| `maxFileSize` | 允許的最大檔案大小（bytes） |
| `keepExtensions: true` | 存檔時保留原始副檔名 |
| `form.parse(req, (err, fields, files) => {})` | 解析請求 |
| `files.欄位名稱[0]` | v3 版本每個欄位是陣列，取第一個檔案 |
| `file.originalFilename` | 原始檔名 |
| `file.size` | 檔案大小（bytes） |
| `file.filepath` | formidable 存到磁碟的實際路徑 |

### 核心觀念
當 formidable 幫我們解析成功後，我們會得到一個 files 物件。前端在 `<input name="欄位名稱">` 內設定的名稱，就會變成 files 物件裡的 Key。

另外，新版 formidable 解析出來的檔案一律會被放在陣列中。因此，即使前端只上傳一個檔案，我們也要使用 `array[0]` 來取得第一個檔案物件。
在引入第三方套件使用時，經常會遇到的就是不同版本之間的語法撰寫差異，所以要特別留意這點唷！

### 使用範例
以下是模擬 formidable 解析成功後，後端撈取資料的標準寫法：
```javascript=
// 引入 formidable
const formidable = require('formidable');

// 假設這是 formidable 解析後傳給我們的 files 物件
const mockFiles = {
  // 假設前端的 input name 是 "avatar"
  avatar: [
    {
      originalFilename: 'profile-picture.png',
      filepath: '/tmp/upload_12345xyz'
    }
  ]
};

// 先利用 Key 找到陣列，再用 [0] 拿第一個檔案
const userAvatar = mockFiles.avatar?.[0];

if (userAvatar) {
  console.log(`收到圖片：${userAvatar.originalFilename}`);
  console.log(`暫存位置：${userAvatar.filepath}`);
}
```

## 題目
請於本地端建立一個 app.js 檔案撰寫。並在完成後合併為一份 CodePen 繳交，若有問答題則透過「註解」進行回答。

> 情境：
> 健身房系統收到了學員上傳的「健康檢查報告」檔案。請你撰寫一個名為 parseMemberFile 的函式，負責將 files 物件中的檔案名稱與路徑撈出來。

任務要求：

1. 補全 `parseMemberFile(files)` 函式：
    - 從 `files.report` 陣列中取得第一個檔案物件。
    - 在函式內使用 console.log 印出該檔案的原始檔名與暫存路徑。
2. 執行主程式，確認終端機能正確印出：
    - `[解析成功] 檔案名稱為: health-report.pdf`
    - `[暫存路徑] 檔案位於: /tmp/file-9999`

初始程式碼
```javascript=
// app.js

// 模擬 formidable 解析後的物件（前端 input name 為 "report"）
const incomingFiles = {
  report: [
    {
      originalFilename: 'health-report.pdf',
      filepath: '/tmp/file-9999'
    }
  ]
};

function parseMemberFile(files) {
  // === 請在此處撰寫你的程式碼 ===
  // 提示：先取得 files.report 的第一個項目，再分別印出屬性
  
  
  // ============================
}

// 測試執行
parseMemberFile(incomingFiles);
```

::: spoiler 點擊即可觀看解答
```javascript=
const incomingFiles = {
  report: [
    {
      originalFilename: 'health-report.pdf',
      filepath: '/tmp/file-9999'
    }
  ]
};

function parseMemberFile(files) {
  // 1. 撈出 report 欄位中的第一個檔案物件
  const reportFile = files.report?.[0];

  if (!reportFile) {
    console.log('[錯誤] 找不到上傳的報告檔案');
    return;
  }

  // 2. 依序取出並印出所需的欄位資訊
  console.log(`[解析成功] 檔案名稱為: ${reportFile.originalFilename}`);
  console.log(`[暫存路徑] 檔案位於: ${reportFile.filepath}`);
}

// 測試執行
parseMemberFile(incomingFiles);
```
:::