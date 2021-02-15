"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelayAsync = void 0;
function DelayAsync(delayInMs) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), delayInMs);
    });
}
exports.DelayAsync = DelayAsync;
//# sourceMappingURL=DelayAsync.js.map