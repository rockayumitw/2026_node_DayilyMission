const fileManager = require('../fileManager');

async function main() {
  const targetFile = './user.txt';
  const textContent = 'Hello Node.js!';

  // 2. 先執行寫入
  await fileManager.saveData(targetFile, textContent);

  // 3. 再執行讀取並印出
  const result = await fileManager.loadData(targetFile);
  
  if (result) {
    console.log(`從檔案讀取出來的內容為: ${result}`);
  }
}

main();
