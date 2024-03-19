const { createWriteStream, createReadStream, readFile } = require("fs");
const {resolve} = require('path');

// 使用 readFile 会将整个文件读取到内存中
readFile(resolve(__dirname, 'big.file'), (err, buffer) => {
  console.log((buffer.length / 1024 / 1024).toFixed(2) + ' MB'); // 450.13 MB
  // console.log(buffer.toString());
});

// 使用 createReadStream 会将文件以流的形式读取到内存中，每次读取一段数据
// const readBigFileStream = createReadStream(resolve(__dirname, 'big.file'), {
//   // 设置缓冲区大小 10MB
//   highWaterMark: 1024 * 1024 * 10
// });
// readBigFileStream.on('data', (data) => {
//   // 未设置缓冲区大小时，每次读取的大小为 0.06MB（64KB）；设置缓冲区大小后，每次读取的大小为 10MB
//   console.log((data.length / 1024 / 1024).toFixed(2) + ' MB');
// });
// readBigFileStream.on('end', () => {
//   console.log('读取完毕');
// });

// 使用可写流将可读流的数据写入文件
// const writeBigFileStream = createWriteStream(resolve(__dirname, 'copy-big.file'));
// readBigFileStream.pipe(writeBigFileStream);