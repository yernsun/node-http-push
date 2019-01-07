

const fs = require('fs')
fs.watch('./', { encoding: 'utf-8', 'recursive': true }, function(eventType, filename) {
  if (filename) {
    console.log(filename, eventType);
    console.log(fs.statSync(filename))
    // Prints: <Buffer ...>
  }
});
