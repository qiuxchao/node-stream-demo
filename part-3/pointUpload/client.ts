import { request } from "http";
import { resolve } from "path";
import { createReadStream } from "fs";

const inputPath = resolve(__dirname, "input.txt");

const options = {
  hostname: "localhost",
  port: 6677,
};

// 获取已上传的长度
const getLen = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    const req = request(
      {
        ...options,
        path: "/getLen",
      },
      (res) => {
        // 处理响应
        let responseData = "";
        res.on("data", (chunk) => {
          responseData += chunk;
        });
        res.on("end", () => {
          resolve(Number(responseData));
        });
      }
    );
    // 处理错误
    req.on("error", reject);
    // 发送请求
    req.end();
  });
};

// 上传没传过的部分
const upload = (finishedLen: number) => {
  const readableStream = createReadStream(inputPath, {
    start: finishedLen,
  });
  return new Promise((resolve, reject) => {
    // 创建请求 req 是一个可写流
    const req = request({
      ...options,
      method: "POST",
    });
    // 处理错误
    req.on("error", reject);
    readableStream.pipe(req).on("finish", resolve);
  });
};

(async () => {
  const len = await getLen();
  console.log("已上传：", len);
  await upload(len);
  console.log("上传完成");
})();
