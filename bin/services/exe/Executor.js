"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const inversify_1 = require("inversify");
require("reflect-metadata");
let Executor = class Executor {
    async Exe(rawCmd) {
        return new Promise((resolve, reject) => {
            // THIS WILL WORK BUT NOT WITH PIPES:
            // const chunks = rawCmd.split(' ');
            // const app = chunks[0];
            // const args = chunks.splice(1);
            // const process = spawn(app, args);
            const process = child_process_1.spawn('sh', ['-c', rawCmd]);
            process.stdout.on('data', (data) => {
                resolve(data.toString());
            });
            process.stderr.on('data', (data) => {
                reject('STDERR: ' + data.toString());
            });
            process.on('error', (error) => {
                reject('ERROR: ' + error.toString());
            });
            process.on('close', (code, signal) => {
                reject('CLOSE: ' + code.toString() + ' ' + signal);
            });
            process.on('disconnect', () => {
                reject('DISCONNECT');
            });
            process.on('exit', (code, signal) => {
                reject('EXIT: ' + code.toString());
            });
            process.on('message', (msg) => {
                reject('MESSAGE: ' + msg);
            });
        });
    }
    ;
};
Executor = __decorate([
    inversify_1.injectable()
], Executor);
exports.Executor = Executor;
//# sourceMappingURL=Executor.js.map