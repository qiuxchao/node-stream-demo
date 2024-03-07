// const fs = require('fs');
// const file = fs.createWriteStream('./big.file');
// for(let  i = 0;i<=1e6;i++) {
//     file.write('Lorem ipsum dolor sit amet, consectetur adipisicing elit. \n');
// }
// file.end();

// const fs = require('fs');
// const server = require('http').createServer();
// server.on('request', (req, res) => {
//     fs.readFile('./big.file', (err, data) => {
//         if(err) throw err;
//         res.end(data);
//     })
// });
// server.listen(8000);

const { Readable } = require('stream'); 
const inStream = new Readable({
  read(size) {
    this.push(String.fromCharCode(this.currentCharCode++) + '\n');
    if (this.currentCharCode > 90) {
      this.push(null);
    }
  }
});
inStream.currentCharCode = 65;
inStream.pipe(process.stdout);