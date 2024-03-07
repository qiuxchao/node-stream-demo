const fs = require('fs');
const zlib = require('zlib');
const file = process.argv[2];

fs.createReadStream(file)
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream(file + '.ungz'));
  