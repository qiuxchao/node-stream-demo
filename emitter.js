const Emitter = require('events');

class MyClass extends Emitter {
  constructor() {
    super();
  }

  myMethod() {
    this.emit('myEvent', 'Hello World');
  }
}

const myClass = new MyClass();
myClass.on('myEvent', (data) => {
  console.log(data);
});

myClass.myMethod();