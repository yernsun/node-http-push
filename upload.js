/**
 * @file node http push for develop
 */
const fs = require('fs');
const request = require('request');
const path = require('path');

class Upload {
    constructor({
        api,
        local,
        map = {},
        remote
    }) {
        this._api = api;
        this._local = local;
        this._remote = remote;
        this._map = map;
    }

    /**
     * @private
     * @param {string} filepath 
     */
    sendFile(filepath) {
        const to = this._getRemotePath(filepath);
        const from = path.join(__dirname, filepath);
        const formData = {
            to,
            file: fs.createReadStream(from)
        }
        request.post({
            url: this._api,
            formData
        }, (err, httpResponse, body) => {
            if (err) {
                return console.error('upload failed:', err);
            }
            console.log(`${filepath} => ${to}`);
        });
    }

    /**
     * @private
     * @param {string} file 
     */
    _getRemotePath(file) {
        let to = `${this._remote}/${file}`;
        file = file.replace(/^\/?[^\/]+\/(.+)$/i, '$1');
        for (const filepath in this._map || {}) {
            const matches = this._map[filepath];
            if (matches instanceof Array) {
                matches.forEach();
            }
            else if (matches instanceof RegExp) {
                if (matches.test(file)) {
                    to = `${this._remote}/${filepath}`;
                }
            }
            else if (typeof matches === 'string') {
                // 后续支持glob
                if ([0, 1].indexOf(file.indexOf(filepath))) {
                    to = filepath;
                }
            }
        }
        return to;
    }

    /**
     * @private
     * @param {string} file 
     */
    _getLocalPath(file) {
        return `${this._local}/${file}`;
    }

    upload(dir) {
        const stats = fs.statSync(dir);
        this._local = dir || this._local;
        if (stats.isDirectory()) {
            fs.readdir(dir, (err, items) => {
                for (let i = 0; i < items.length; i++) {
                    this.upload(`${dir}/${items[i]}`);
                }
            })
        } else if (stats.size > 0) {
            this.sendFile(dir);
        } else {
            console.warn(`upload empty file named "${dir}"`);
        }
    }
}

module.exports = (config) => {
    return new Upload(config);
}
