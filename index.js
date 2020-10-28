const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');


const userAgents = {
    "pc": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36 Edg/85.0.564.63",
    "android": "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Mobile Safari/537.36 Edg/85.0.564.63",
    "ios": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/85.0.4183.121"
}

class Fetch {
    constructor(ua = "pc", cookie = null) {
        let u = userAgents[ua];
        if (!u) u = ua;
        this.headers = {
            "User-Agent": u
        };
        if (cookie) {
            this.headers.Cookie = cookie;
        }
        //console.info(this.headers);
    }
    setHeader(name, value) {
        let o = {};
        o[name] = value;
        Object.assign(this.headers, o);
    }
    async get(url, params) {
        let p = this.setparams(params);
        //console.info(p);
        let res = await fetch(url, p);
        return await res.text();
    }

    async getJSON(url, params) {
        let p = this.setparams(params);
        let res = await fetch(url, p);
        return await res.json();
    }

    async get$(url, params) {
        let t = await this.get(url, params);
        return cheerio.load(t);
    }

    async download(url, params, filepath) {
        let p = this.setparams(params);
        let res = await fetch(url, p);
        let buffer = await res.arrayBuffer();
        fs.writeFileSync(filepath, Buffer.from(buffer));
    }

    setparams(params) {
        let p = Object.assign({}, params);
        p.headers = Object.assign({}, this.headers, p.headers);
        return p;
    }
}

module.exports = Fetch;