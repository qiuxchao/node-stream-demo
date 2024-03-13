const { createGzip, createGunzip } = require("zlib");
const { createReadStream, createWriteStream } = require("fs");
const { resolve } = require("path");

const inputFile = resolve(__dirname, "big.file");
const outputFile = resolve(__dirname, "big.file.gz");
const unGunzipFile = resolve(__dirname, "big.file.ungz");

// 压缩
createReadStream(inputFile)
  .pipe(createGzip())
  .pipe(createWriteStream(outputFile));

// 解压
// createReadStream(outputFile)
//   .pipe(createGunzip())
//   .pipe(createWriteStream(unGunzipFile));