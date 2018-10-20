"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1;
"use strict";
const LogEntry_1 = require("./LogEntry");
const LogType_1 = require("./LogType");
const LoggerConfig_1 = require("./LoggerConfig");
const inversify_1 = require("inversify");
let Logger = Logger_1 = class Logger {
    constructor() {
        this.config = new LoggerConfig_1.LoggerConfig();
    }
    Config(config) {
        this.config = config;
    }
    TimeMark(time) {
        return (time.toLocaleTimeString());
    }
    ObjectToString(obj) {
        if (obj === undefined) {
            return 'undefined';
        }
        else if (obj === null) {
            return 'null';
        }
        else if (obj instanceof Object) {
            return JSON.stringify(obj);
        }
        else {
            return obj;
        }
    }
    ArgsToString(args) {
        return args.map(i => this.ObjectToString(i)).join(' ');
    }
    Message(type, path, time, args) {
        return `[${type} in ${path}] ${this.ArgsToString(args)} @ ${this.TimeMark(time)}`;
    }
    BuildEntry(type, path, ...args) {
        const entry = new LogEntry_1.LogEntry();
        entry.type = type;
        entry.path = path;
        entry.args = args;
        entry.time = new Date();
        entry.message = this.Message(type, path, entry.time, args);
        return entry;
    }
    SendEntry(entry) {
        if ((this.config !== undefined) && this.config.output) {
            this.config.output(entry);
        }
        else {
            console.log('[' + Logger_1.name + '] No log output specified');
        }
    }
    BuildEntryAndSend(type, path, ...args) {
        const entry = this.BuildEntry(type, path, ...args);
        this.SendEntry(entry);
    }
    Info(path, ...args) {
        this.BuildEntryAndSend(LogType_1.LogType.Info, path, ...args);
    }
    Warn(path, ...args) {
        this.BuildEntryAndSend(LogType_1.LogType.Warning, path, ...args);
    }
    Ex(path, ...args) {
        this.BuildEntryAndSend(LogType_1.LogType.Exception, path, ...args);
    }
};
Logger = Logger_1 = __decorate([
    inversify_1.injectable()
], Logger);
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map