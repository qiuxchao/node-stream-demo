import { createServer } from "http";
import { resolve } from "path";
import { createWriteStream, statSync } from "fs";

const savePath = resolve(__dirname, "output.txt");

createServer((req, res) => {
  console.log(req.url);

  // 创建写入流，用于写入文件
  const fileStream = createWriteStream(savePath, { flags: "a" });

  // 获取已经接收到的文件大小
  let len = statSync(savePath).size;

  // 获取已上传的文件大小接口
  if (req.url?.includes("getLen")) {
    res.end(len.toString());
    return;
  }

  req.pipe(fileStream).on("finish", () => {
    res.end("ok");
  });
}).listen(6677);
