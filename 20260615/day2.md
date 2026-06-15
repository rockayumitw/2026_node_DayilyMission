# 🏅 Day 2 - 單一職責原則

隨著專案功能越來越多，我們常不自覺地把「密碼加密」、「格式檢查」、「寫入資料庫」、「發送 Email 通知」通通寫在同一個主程式或同一個函式裡。這樣把所有功能都放在一起的程式碼，會導致後續維護難度指數提升，單一職責原則就是為了解決該問題而誕生的規範。

### 單一職責原則

單一職責原則 (SRP) 的核心精神非常簡單：

「一個模組、類別或函式，應該只負責一件事。換句話說，讓它需要被修改的原因只有一個。」

如果一個函式管太多事，只要其中一個小功能需要調整（例如：Email 廠商換人、或密碼規則變嚴格），你就必須去改動那條又長又亂的程式碼，進而大大提升「改 A 壞 B」的風險。

### 糟糕的範例 vs 優雅的 SRP 範例

1. 違反 SRP 的函式
   以下這個函式同時管了「格式檢查」、「檔案寫入」與「記錄 Log」三件事。如果未來只想改 Log 的格式，卻不小心動到寫入檔案的邏輯，系統就崩潰了。

   ```javascript=
   const fs = require('fs/promises');

   // 這個函式管太寬了！
   async function registerUser(userData) {
     // 職責一：檢查資料格式
     if (!userData.email.includes('@')) {
       console.error('Email 格式錯誤');
       return;
     }

     // 職責二：把會員資料寫入檔案
     try {
       await fs.writeFile('./users.json', JSON.stringify(userData));

       // 職責三：記錄操作 Log
       const logMessage = `[LOG] 使用者 ${userData.email} 於 ${new Date().toISOString()} 註冊成功\n`;
       await fs.appendFile('./activity.log', logMessage);

       console.log('註冊成功');
     } catch (err) {
       console.error('操作失敗');
     }
   }
   ```

2. 符合 SRP 的模組化拆分
   依據單一職責原則，我們應該將不同的工作發包給專門的專家（拆分成獨立函式或模組）：

   ```javascript=
   const fs = require('fs/promises');

   // 專家一：負責驗證
   function validateEmail(email) {
     return email.includes('@');
   }

   // 專家二：負責檔案儲存
   async function saveUserData(userData) {
     await fs.writeFile('./users.json', JSON.stringify(userData));
   }

   // 專家三：負責記錄 Log
   async function logActivity(message) {
     const logMessage = `[LOG] ${message} - ${new Date().toISOString()}\n`;
     await fs.appendFile('./activity.log', logMessage);
   }

   // 主流程：像總理一樣，只負責呼叫底下的專家，自己不跳下去做雜事
   async function registerUser(userData) {
     if (!validateEmail(userData.email)) {
       console.error('Email 格式錯誤');
       return;
     }

     try {
       await saveUserData(userData);
       await logActivity(`使用者 ${userData.email} 註冊成功`);
       console.log('註冊成功');
     } catch (err) {
       console.error('註冊流程失敗');
     }
   }
   ```

## 題目

以下題目請於本地端建立 app.js 檔案撰寫。並在完成後合併為一份 CodePen 繳交，若有問答題則透過「註解」進行回答。

> 情境：
> 目前團隊有一段剛寫好、專門處理「訂單建立」的程式碼。但這段程式碼在 createOrder 函式中嚴重違反了單一職責原則（同時包含：價格數字檢查、建立訂單 Log 檔案）。

請參考前一天的 fs/promises 練習與 SRP 原則，將這段程式碼拆分成多個職責單一的函式，讓主函式只負責掌控流程。

初始程式碼（請將其拆分優化）

```javascript=
// 原始 app.js
const fs = require('fs/promises');

async function createOrder(orderData) {
  try {
    // 1. 檢查金額是否大於 0 (職責一)
    if (orderData.price <= 0) {
      throw new Error('訂單金額不可小於或等於 0');
    }

    // 2. 建立訂單 Log 檔案 (職責二)
    const logContent = `訂單編號: ${orderData.id}, 金額: ${orderData.price}`;
    await fs.writeFile(`./order-${orderData.id}.txt`, logContent);
    console.log('訂單儲存成功！');

  } catch (err) {
    console.error(`失敗: ${err.message}`);
  }
}

createOrder({ id: 'A001', price: 500 });
```

拆分任務要求：

1. 抽離出一個 isValidPrice(price) 函式，專門檢查金額是否大於 0，並回傳布林值（true 或 false）。
2. 抽離出一個 writeOrderLog(id, price) 非同步函式，內含 try...catch，專門負責將訂單文字寫入檔案。
3. 重構 createOrder(orderData) 主流程函式，使其不直接處理驗證邏輯與檔案寫入語法，而是透過呼叫上面兩個拆分出來的函式來完成任務。

::: spoiler 點擊即可觀看解答

```javascript=
const fs = require('fs/promises');

// 職責一：資料驗證邏輯
function isValidPrice(price) {
  return price > 0;
}

// 職責二：檔案寫入與日誌管理
async function writeOrderLog(id, price) {
  try {
    const logContent = `訂單編號: ${id}, 金額: ${price}`;
    await fs.writeFile(`./order-${id}.txt`, logContent);
    console.log(`[成功] 訂單 ${id} 檔案建立完成`);
    return true;
  } catch (err) {
    console.error(`[錯誤] 檔案寫入失敗: ${err.message}`);
    return false;
  }
}


// 主流程控制

async function createOrder(orderData) {
  // 1. 呼叫驗證函式
  if (!isValidPrice(orderData.price)) {
    console.error('訂單失敗: 訂單金額不可小於或等於 0');
    return;
  }

  // 2. 呼叫日誌檔案函式
  await writeOrderLog(orderData.id, orderData.price);
}

// 測試執行
createOrder({ id: 'A001', price: 500 });
createOrder({ id: 'A002', price: -20 }); // 這行會觸發驗證攔截，且不會產生錯誤檔案
```
