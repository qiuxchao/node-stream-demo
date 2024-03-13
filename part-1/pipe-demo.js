const fs = require("fs");
const zlib = require("zlib");
const crypto = require("crypto");

// 创建输入流（从文件读取数据）
const inputFilePath = "input.txt";
const inputStream = fs.createReadStream(inputFilePath);

// 创建中间处理流，将一个流的输出作为另一个流的输入
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32); // 256位密钥
const iv = crypto.randomBytes(16); // 128位初始化向量
const encryptStream = crypto.createCipheriv(algorithm, key, iv); // 加密流
const decryptStream = crypto.createDecipheriv(algorithm, key, iv); // 解密流
const gzipStream = zlib.createGzip(); // 压缩流
const gunzipStream = zlib.createGunzip(); // 解压流

// 创建输出流（将数据存储到文件中）
const outputFilePath = "output.gz";
const outputStream = fs.createWriteStream(outputFilePath);

// 使用.pipe()方法将流连接起来形成管道
inputStream
  .pipe(gzipStream)
  .pipe(encryptStream)
  .pipe(outputStream)
  .on("finish", () => {
    console.log("加密完成");
    // 解密
    fs.createReadStream(outputFilePath)
      .pipe(decryptStream)
      .pipe(gunzipStream)
      .pipe(fs.createWriteStream("output-decrypt.txt"))
      .on("finish", () => {
        console.log("解密完成");
      });
  });
