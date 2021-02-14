"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecResult = void 0;
class ExecResult {
    constructor(command, code, stdout, stderr, id, duration) {
        this.command = command;
        this.code = code;
        this.stdout = stdout;
        this.stderr = stderr;
        this.id = id;
        this.duration = duration;
    }
    get Command() {
        return this.command;
    }
    get IsSuccess() {
        return this.code === 0;
    }
    get StdOut() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.stdout) === null || _a === void 0 ? void 0 : _a.toString()) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : "";
    }
    get StdErr() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.stderr) === null || _a === void 0 ? void 0 : _a.toString()) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : "";
    }
    get Message() {
        var _a;
        return ((_a = this.StdOut) === null || _a === void 0 ? void 0 : _a.length) ? this.StdOut : this.StdErr;
    }
}
exports.ExecResult = ExecResult;
//# sourceMappingURL=ExecResult.js.map