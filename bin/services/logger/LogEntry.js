"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogType_1 = require("./LogType");
class LogEntry {
    constructor() {
        this.type = LogType_1.LogType.Info;
        this.path = "";
        this.args = [];
        this.message = "";
        this.time = new Date();
    }
}
exports.LogEntry = LogEntry;
//# sourceMappingURL=LogEntry.js.map