const { Readable } = require("stream");

/**
 * 等待一个随机时间后解决Promise。
 * @param {number} minMillis 最小等待时间（毫秒）。
 * @param {number} maxMillis 最大等待时间（毫秒）。
 * @returns {Promise<string>} 一个Promise，解决时返回等待的时间（毫秒）。
 */
function waitRandomTime(minMillis, maxMillis) {
  // 创建一个Promise，它将随机延迟一段时间后解决
  return new Promise((resolve) => {
    // 计算一个随机延迟时间
    const randomDelay =
      Math.floor(Math.random() * (maxMillis - minMillis + 1)) + minMillis;
    // 使用setTimeout设置一个定时器，在随机延迟后调用resolve
    setTimeout(() => {
      resolve(`Waited for ${randomDelay} milliseconds.`);
    }, randomDelay);
  });
}

class MyReadable extends Readable {
  constructor(max) {
    super({
      objectMode: true,
    });
    this.count = 0;
    this.max = max;
  }

  async _read() {
    if (this.count <= this.max) {
      await waitRandomTime(100, 500);
      this.push(`${this.count}`);
      this.count++;
    } else {
      this.push(null);
    }
  }
}

const max = 10;
const myReadable = new MyReadable(max);
console.log(myReadable.readableFlowing); // false
myReadable.on("data", (data) => {
  console.log(data);
  // console.log(myReadable.readableFlowing); // true
});
