# node-http-push

## for common
you should add watch for the file
```javascript
new Upload({
    local: 'dist',
    api,
    remote: '/home/users/sunyueran/webroot/test'
}).upload('dist');
```

##  for webpack

```javascript
const webpack = require('webpack');
const config = require('webpackConfig');
// for webpack watch build
const compiler = webpack(webpackConfig, (err, stats) => {
        spinner.stop();
        if (err) {
            throw err;
        }
        if (stats.hasErrors()) {
            console.log('  Build failed with errors.\n');
            process.exit(1);
        }
    });
    const watching = compiler.watch({
            ignored: /node_modules/,
            poll: 300
        }, (err, stats) => {
            console.log('\x1b[31m Rebuild \x1b[0m');
    });
```