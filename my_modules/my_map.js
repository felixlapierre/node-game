const fs = require('fs');
var exports = module.exports = {};

function load(path) {
  fs.readFile(path, function(err, data) {
    if(err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
}

exports.load = load;
