# 紀錄

1. 安裝 TypeScript 相關套件
```
npm install typescript @types/node @types/express --save-dev
```

2. 建立 tsconfig.json
產生 tsconfig.json 後，基本的設定通常就足夠了。
可以確保 "target": "ES2022"（或更高）以及 "moduleResolution": "node" 是開啟的。
```
npx tsc --init
```


3. 調整 package.json 設定
```
{
  "name": "20260623",
  "version": "1.0.0",
  "type": "module",  // <-- 改為 module
  "scripts": {
    "dev": "npx ts-node app.ts",
  }
  "dependencies": { ... },
}
```

3. 執行編譯
在開發階段，你可以使用 ts-node（需要另外安裝）直接執行 .ts 檔案，或者透過 tsc 編譯成 .js 後再執行。
```ts
npm install -D ts-node

// 執行
npx ts-node app.ts
```

4. 安裝 cors 套件

```
npm install cors @types/cors --save
```