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
exports.Config = void 0;
const fs = require("fs");
require("reflect-metadata");
const inversify_1 = require("inversify");
const Types_1 = require("../../IoC/Types");
let Config = class Config {
    constructor(_args) {
        this._args = _args;
        const configFileDir = this._args.Args.config || './config.json';
        const configFileContent = fs.readFileSync(configFileDir, 'utf8');
        this.config = JSON.parse(configFileContent);
    }
    get LogsLevel() {
        if (this._args.Args.logsLevel !== undefined)
            return +this._args.Args.logsLevel;
        if (this.config.logsLevel !== undefined)
            return this.config.logsLevel;
        return 1;
    }
    get ServerPort() {
        return this._args.Args.serverPort || this.config.serverPort || 3000;
    }
    get Routes() {
        return this.config.routes;
    }
    get Statics() {
        return this.config.statics;
    }
    get Shell() {
        return this.config.shell || "sh"; // 'sh' for linux, 'powershell' for windows
    }
};
Config = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.IStartupArgs)),
    __metadata("design:paramtypes", [Object])
], Config);
exports.Config = Config;
//# sourceMappingURL=Config.js.map