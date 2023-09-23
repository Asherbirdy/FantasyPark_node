### Postman Environment 設定：

```json
Variable:URL
Initail value : https://fanstypark.onrender.com/api/v1
Current value:https://fanstypark.onrender.com/api/v1

// 如果在本機操作 改成 http://localhost:5000/api/v1
```

### .env

新增env檔案來連接資料庫和設定JWT

```json
# 資料庫：
MONGO_URL=mongodb://admin:admin@127.0.0.1:27017
JWT_SECRET=<設定自己的參數>
JWT_LIFETIME=30d
```

### 匯入這些資料 :

1. 在檔案裡的 starter資料夾 有個 Fantasy Park API Doc.postman_collection.json 可以匯入 Postman
2. Postman :在檔案裡的 starter資料夾 有個 test.ticketcategories.json 可以匯入 mongoDB

### 權限：（建議第一筆註冊帳號）

```jsx
// admin 帳號密碼(所有權限) ：為了QRCODE驗證用
email:dev@gmail.com
password:password
```