"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const Types_1 = require("../../IoC/Types");
let Logger = class Logger {
    constructor(_config, _output) {
        this._output = _output;
        this.LogEnable = false;
        this.TraceEnable = false;
        this.SetLogLevel(_config.LogsLevel);
    }
    SetLogLevel(level) {
        switch (level) {
            case 0:
                this.LogEnable = false;
                this.TraceEnable = false;
                break;
            case 1:
                this.LogEnable = true;
                this.TraceEnable = false;
                break;
            case 2:
                this.LogEnable = true;
                this.TraceEnable = true;
                break;
        }
    }
    Log(...params) {
        if (this.LogEnable) {
            const str = params.map(this.ObjectToString).join(' ');
            this._output.Print(str);
            return str;
        }
        else
            return '';
    }
    Trace(...params) {
        if (this.TraceEnable) {
            return this.Log('  ', ...params);
        }
        else
            return '';
    }
    Error(...params) {
        const str = params.map(this.ObjectToString).join(' ');
        this._output.Print(str);
    }
    ObjectToString(obj) {
        if (obj.constructor === String) {
            return obj.replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r')
                .replace(/\t/g, '\\t');
            // return obj.replace(/\n/g, '<NL>')
            //     .replace(/\r/g, '<CR>')
            //     .replace(/\t/g, '<TAB>');
        }
        else if (obj === undefined) {
            return 'undefined';
        }
        else if (obj === null) {
            return 'null';
        }
        else if (obj instanceof Object) {
            return JSON.stringify(obj)
                .replace(/{"/g, "{ ")
                .replace(/}/g, " }")
                .replace(/,"/g, ", ")
                .replace(/":/g, ": ");
        }
        else {
            return obj;
        }
    }
};
Logger = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.IConfig)),
    __param(1, inversify_1.inject(Types_1.Types.ILoggerOutput)),
    __metadata("design:paramtypes", [Object, Object])
], Logger);
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map