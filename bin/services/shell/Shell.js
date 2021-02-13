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
};
Shell = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.ILogger)),
    __metadata("design:paramtypes", [Object])
], Shell);
exports.Shell = Shell;
// @injectable()
// export class Shell implements IShell
// {
//     constructor(@inject(Types.IConfig) private _config: IConfig)
//     { }
//     private process!: ChildProcessWithoutNullStreams;
//     public Dispose()//???????///
//     {
//         this.process.stdout.removeAllListeners();
//         this.process.stderr.removeAllListeners();
//         this.process.removeAllListeners();
//     }
//     public async Exe(rawCmd: string): Promise<string> 
//     {
//         return new Promise<string>((resolve, reject) => 
//         {
//             this.process = spawn(this._config.Shell, ['-c', rawCmd], { detached: false } );
//             let response = "";
//             let isErr = false;
//             this.process.stdout.on('data', (data) =>
//             {
//                 response += data.toString();
//             });
//             this.process.stderr.on('data', (data) =>
//             {
//                 response += data.toString();
//                 isErr = true;
//             });
//             this.process.stderr.on('end', () =>
//             {
//                 if (isErr) 
//                 {
//                     reject(response);
//                 }
//                 else 
//                 {
//                     resolve(response);
//                 }
//             });
//             this.process.on('error', (error: Error) =>
//             {
//                 reject('ERROR: ' + error);
//             });
//             this.process.on('close', (code, signal) =>
//             {
//                 reject('CLOSE: ' + code.toString() + ' ' + signal);
//             });
//             this.process.on('disconnect', () =>
//             {
//                 reject('DISCONNECT');
//             });
//             this.process.on('exit', (code, signal) =>
//             {
//                 /* do nothing, especially do not reject here */
//                 if (isErr) //???????????????????????????????????????
//                 {
//                     reject(response);
//                 }
//                 else 
//                 {
//                     resolve(response);
//                 }
//             });
//             this.process.on('message', (msg) =>
//             {
//                 reject('MESSAGE: ' + msg);
//             });
//         });
//     };
// }
//# sourceMappingURL=Shell.js.map