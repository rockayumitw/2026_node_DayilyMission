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

  const rf = files.report?.[0];
  if (!rf) {
    console.log('[錯誤] 找不到上傳的報告檔案');
    return
  }

  // 2. 依序取出並印出所需的欄位資訊
  console.log(`[解析成功] 檔案名稱為: ${rf.originalFilename}`);
  console.log(`[暫存路徑] 檔案位於: ${rf.filepath}`);
}

// 測試執行
parseMemberFile(incomingFiles);