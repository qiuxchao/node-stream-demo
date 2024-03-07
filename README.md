# Nodejs 中的流（Streams）

在计算机科学中，流（Stream）是一种处理数据的方式，它允许我们将数据看作是持续不断的序列，而不是一次性全部加载到内存中的完整集合。

在 Node.js 中，流机制扮演着至关重要的角色，特别是在处理大文件、实时数据流、网络通信等领域，它能有效地节省内存资源，提高应用程序性能。

在构建较复杂的系统时，通常将其拆解为功能独立的若干部分。这些部分的接口遵循一定的规范，通过某种方式相连，以共同完成较复杂的任务。譬如，Shell 通过管道 `|` 连接各部分，其输入输出的规范是文本流，在 Node.js 中，内置的 `stream` 模块也实现了类似功能，各部分通过 `.pipe()` 连接。

> 提示：Shell 中的管道（pipe）是一种特殊的操作符 `|`，它用于将一个命令的输出连接到另一个命令的输入，从而实现两个或多个命令之间的数据传输。

## 流的基本使用

Node.js 中的流可以分为四种类型：可读流（Readable）、可写流（Writable）、双工流（Duplex）和转换流（Transform）。每种类型都有其特定的用途和功能。

```js
const Stream = require("stream");

const Readable = Stream.Readable;
const Writable = Stream.Writable;
const Duplex = Stream.Duplex;
const Transform = Stream.Transform;
```

### 可读流（Readable Streams）

可读流用于读取数据。它们提供一个接口来从数据源（如文件、网络请求或其他可写流）读取数据。你可以监听可读流的 `'data'` 事件来处理每次接收到的数据块。

创建可读流时，需要继承 `Readable`，并实现 `_read` 方法。

- `_read` 方法是从底层系统读取具体数据的逻辑，即生产数据的逻辑。
- 在 `_read` 方法中，通过调用 `push(data)` 将数据放入可读流中供下游消耗。
- 在 `_read` 方法中，可以同步调用 `push(data)`，也可以异步调用。
- 当全部数据都生产出来后，必须调用 `push(null)` 来结束可读流。
- 流一旦结束，便不能再调用 `push(data)` 添加数据。

可以通过监听 `data` 事件的方式消耗可读流。

- 在首次监听其 `data` 事件后，`readable` 便会持续不断地调用 `_read()`，通过触发 `data` 事件将数据输出。
- 第一次 `data` 事件会在下一个事件循环 tick 中触发，所以，可以安全地将数据输出前的逻辑放在事件监听后（同一个 tick 中）。
- 当数据全部被消耗时，会触发 `end` 事件。

```js
const { Readable } = require("stream");

// 创建可读流
class ToReadable extends Readable {
  constructor(iterator) {
    super();
    this.iterator = iterator;
  }

  // 子类需要实现该方法
  // 这是生产数据的逻辑
  _read() {
    const res = this.iterator.next();
    if (res.done) {
      // 数据源已枯竭，调用 `push(null)` 通知流
      return this.push(null);
    }
    setTimeout(() => {
      // 通过 `push` 方法将数据添加到流中
      this.push(res.value + "\n");
    }, 0);
  }
}

function* generator() {
  let i = 0;
  while (i < 10) {
    yield i++;
  }
}

const iterator = generator();

const readable = new ToReadable(iterator);

// 监听`data`事件，一次获取一个数据
readable.on("data", (data) => {
  // 将数据写入到标准输出流
  process.stdout.write(data);
});

readable.on("end", () => {
  process.stdout.write("DONE");
});
```

### 可写流（Writable Streams）

可写流用于写入数据。它们提供一个接口来将数据写入目标（如文件、网络请求或其他可读流）。你可以使用 `write()` 方法写入数据，然后监听 `'finish'` 事件来检测写入操作是否完成。

- 上游通过调用 `writable.write(data)` 将数据写入可写流中。`write()` 方法会调用 `_write()` 将 data 写入底层。
- 在 `_write` 中，当数据成功写入底层后，必须调用 `next(err)` 告诉流开始处理下一个数据。
- `next` 的调用既可以是同步的，也可以是异步的。
- 上游必须调用 `writable.end(data)` 来结束可写流，data 是可选的。此后，不能再调用 `write` 新增数据。
- 在 `end` 方法调用后，当所有底层的写操作均完成时，会触发 `finish` 事件。

```js
const { Writable } = require("stream");
const { writeFileSync } = require("fs");
const { resolve } = require("path");

const writable = new Writable();

// 实现 `_write` 方法
// 这是将数据写入底层的逻辑

writable._write = function (chunk, encoding, next) {
  // 将流中的数据写入底层
  process.stdout.write(chunk.toString().toUpperCase());
  writeFileSync(
    resolve(__dirname, "./writeable-test.txt"),
    chunk.toString().toUpperCase(),
    {
      encoding: "utf8",
      // 追加模式
      flag: "a",
    }
  );
  // 写入完成时，调用 `next()` 方法通知流传入下一个数据
  process.nextTick(next);
};

// 所有数据均已写入底层
writable.on("finish", () => process.stdout.write("DONE"));

// 将一个个数据写入流中
writable.write("a" + "\n");
writable.write("b" + "\n");
writable.write("c" + "\n");

// 再无数据写入流时，调用 `end()` 方法结束流
writable.end();
```

### 双工流（Duplex Streams）

双工流是同时可读和可写的流。它们既能读取数据，也能写入数据。例如，WebSocket 就是一种双工流。你可以通过创建自定义的双工流来实现特定的需求。

`Duplex` 实际上就是继承了 `Readable` 和 `Writable` 的一类流。 所以，一个 `Duplex` 对象既可当成可读流来使用（需要实现 `_read` 方法），也可当成可写流来使用（需要实现 `_write` 方法）。

```js
const { Duplex } = require("stream");

const duplex = Duplex();

// 可读端底层逻辑
duplex._read = function () {
  this._readNum = this._readNum || 0;
  if (this._readNum > 1) {
    this.push(null);
  } else {
    this.push("" + this._readNum++);
  }
};

// 可写端底层逻辑
duplex._write = function (chunk, encoding, next) {
  console.log(chunk.toString());
  next();
};

// 0, 1
duplex.on("data", (data) => console.log(`ondata: ${data}`));

duplex.write("a");
duplex.write("b");
duplex.end();
```

上面的代码中实现了 `_read` 方法，所以可以监听 `data` 事件来消耗 `Duplex` 产生的数据。 同时，又实现了 `_write` 方法，可作为下游去消耗数据。

因为它既可读又可写，所以称它有两端：可写端和可读端。 可写端的接口与 `Writable` 一致，作为下游来使用；可读端的接口与 `Readable` 一致，作为上游来使用。

### 转换流（Transform Streams）

在上面的例子中，可读流中的数据（0, 1）与可写流中的数据（'a', 'b'）是隔离开的，但在 `Transform` 中可写端写入的数据经变换后会自动添加到可读端。 `Transform` 继承自 `Duplex`，并已经实现了 `_read` 和 `_write` 方法，同时要求用户实现一个 `_transform` 方法。

```js
const { Transform } = require("stream");

const transform = new Transform();

// 将写入的数据转换为大写
transform._transform = function (chunk, encoding, next) {
  const res = chunk.toString().toUpperCase();
  this.push(res);
  next();
};

transform.on('data', (data) => console.log(data.toString()));

transform.write('a');
transform.write('b');
transform.write('c');
transform.end();

// A
// B
// C
```

### 对象模式（Object Mode）

在上面的例子中，经常看到调用 `data.toString()`。这是因为可读流和可写流默认情况下都是以 `Buffer` 类型来传输数据的，如果我们不调用 `.toString()`，则会看到如下输出：

```bash
<Buffer 61>
<Buffer 62>
```

不过，每个构造函数都接收一个配置对象，其中有一个 `objectMode` 的选项，一旦设置为 `true`，数据会被解析为 JavaScript 对象，而不是 Buffer 对象。

```js
const { Transform } = require("stream");

const transform = new Transform({
  // 使用对象模式
  objectMode: true,
});

// 将写入的数据转换为大写
transform._transform = function (chunk, encoding, next) {
  // 不再需要 .toString()
  const res = chunk.toUpperCase();
  this.push(res);
  next();
};

transform.on("data", (data) => {
  // 不再需要 .toString()
  console.log(data.toString());
});

transform.write("a");
transform.write("b");
transform.write("c");
transform.end();

// A
// B
// C
```

### 管道（Pipeline）

通过 `.pipe()` 方法将多个流链接起来，形成一个数据处理流水线，使得数据可以从一个流无缝流动到另一个流。

## 流式处理与背压（back pressure）的工作原理

## 流式程序应用
