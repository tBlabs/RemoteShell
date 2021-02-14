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
const inversify_1 = require("inversify");
const shell = require("shelljs");
const Types_1 = require("../../IoC/Types");
const ExecResult_1 = require("./ExecResult");
const child_process_1 = require("child_process");
let Shell = class Shell {
    constructor(_log) {
        this._log = _log;
        shell.config.silent = true;
    }
    ExecAsync(cmd, id) {
        return new Promise((resolve, reject) => {
            this._log.Log(`Exec #${id}: ${cmd}`);
            const start = +new Date();
            shell.exec(cmd, (code, stdout, stderr) => {
                const duration = +new Date() - start;
                const result = new ExecResult_1.ExecResult(cmd, code, stdout, stderr, id, duration);
                this._log.Log(`Result #${id}:`, result.Message, `(took ${result.duration} ms)`);
                resolve(result);
            });
        });
    }
    async RunInBackground(cmd, wd) {
        // return new Promise((resolve, reject) =>
        // {
        const s = child_process_1.spawn(cmd[0], [...cmd.slice(1)], { stdio: 'ignore', cwd: wd, detached: true });
        s.on('error', (err) => {
            console.log('PROCESS ERROR', err);
            // reject(err);
        });
        s.on('close', (code) => {
            console.log(`PROCESS CLOSED`, code, s.pid);
            // resolve(s.pid); 
        });
        s.on('spawn', () => {
            console.log(`PROCESS SPAWNED`, s.pid);
            // resolve(s.pid); 
        });
        s.unref();
        return s.pid;
        // });
    }
};
Shell = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.ILogger)),
    __metadata("design:paramtypes", [Object])
], Shell);
exports.Shell = Shell;
//# sourceMappingURL=Shell.js.map