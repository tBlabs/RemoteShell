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
exports.Shell = void 0;
require("reflect-metadata");
const child_process_1 = require("child_process");
const inversify_1 = require("inversify");
const Types_1 = require("../../IoC/Types");
let Shell = class Shell {
    constructor(_config) {
        this._config = _config;
    }
    Dispose() {
        this.process.stdout.removeAllListeners();
        this.process.stderr.removeAllListeners();
        this.process.removeAllListeners();
    }
    async Exe(rawCmd) {
        return new Promise((resolve, reject) => {
            this.process = child_process_1.spawn(this._config.Shell, ['-c', rawCmd], { detached: false });
            let response = "";
            let isErr = false;
            this.process.stdout.on('data', (data) => {
                response += data.toString();
            });
            this.process.stderr.on('data', (data) => {
                response += data.toString();
                isErr = true;
            });
            this.process.stderr.on('end', () => {
                if (isErr) {
                    reject(response);
                }
                else {
                    resolve(response);
                }
            });
            this.process.on('error', (error) => {
                reject('ERROR: ' + error);
            });
            this.process.on('close', (code, signal) => {
                reject('CLOSE: ' + code.toString() + ' ' + signal);
            });
            this.process.on('disconnect', () => {
                reject('DISCONNECT');
            });
            this.process.on('exit', (code, signal) => {
                /* do nothing, especially do not reject here */
                if (isErr) //???????????????????????????????????????
                 {
                    reject(response);
                }
                else {
                    resolve(response);
                }
            });
            this.process.on('message', (msg) => {
                reject('MESSAGE: ' + msg);
            });
        });
    }
    ;
};
Shell = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.IConfig)),
    __metadata("design:paramtypes", [Object])
], Shell);
exports.Shell = Shell;
//# sourceMappingURL=Shell.js.map