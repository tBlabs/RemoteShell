"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Get = exports.Post = exports.calls = void 0;
const axios_1 = require("axios");
exports.calls = 0;
async function Post(url, data, headers) {
    exports.calls++;
    try {
        // console.log('POST', url, data, headers);
        const response = await axios_1.default.post(url, data, { headers, timeout: 5 * 1000 });
        // console.log(response.status, response.data);
        return ({ status: response.status, data: response.data });
    }
    catch (ex) {
        console.log(`#${exports.calls} EXCEPTION @ "${url}": ${ex.message}`);
        throw new Error(ex.message);
    }
}
exports.Post = Post;
async function Get(url, headers) {
    exports.calls++;
    try {
        // console.log('POST', url, data, headers);
        const response = await axios_1.default.get(url, { headers, timeout: 5 * 1000 });
        // console.log(response.status, response.data);
        return ({ status: response.status, data: response.data });
    }
    catch (ex) {
        console.log(`#${exports.calls} EXCEPTION @ "${url}": ${ex.message}`);
        throw new Error(ex.message);
    }
}
exports.Get = Get;
//# sourceMappingURL=Post.js.map