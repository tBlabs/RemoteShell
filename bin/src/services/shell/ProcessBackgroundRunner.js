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
exports.ProcessBackgroundRunner = void 0;
const inversify_1 = require("inversify");
const Types_1 = require("../../IoC/Types");
let ProcessBackgroundRunner = class ProcessBackgroundRunner {
    constructor(_shell) {
        this._shell = _shell;
    }
    async Start(process) {
        var _a;
        try {
            const splitted = (_a = process.Cmd) === null || _a === void 0 ? void 0 : _a.split(' '); // TODO: usuwanie podwójnych spacji? ale poza rzeczami w apostrofach
            const pid = await this._shell.RunInBackground(splitted, process.Wd);
            return pid;
        }
        catch (error) {
            throw new Error(`Could not start process`);
        }
    }
    async Stop(pid) {
        return (await this._shell.ExecAsync(`sudo kill ${pid}`)).IsSuccess;
    }
};
ProcessBackgroundRunner = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.IShell)),
    __metadata("design:paramtypes", [Object])
], ProcessBackgroundRunner);
exports.ProcessBackgroundRunner = ProcessBackgroundRunner;
//# sourceMappingURL=ProcessBackgroundRunner.js.map