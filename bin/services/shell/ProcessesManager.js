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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessesManager = void 0;
const inversify_1 = require("inversify");
const ProcessBackgroundRunner_1 = require("./ProcessBackgroundRunner");
const ProcessesList_1 = require("./ProcessesList");
let ProcessesManager = class ProcessesManager {
    constructor(_runner, _list) {
        this._runner = _runner;
        this._list = _list;
    }
    async Start(process) {
        try {
            if (this._list.IsAlreadyRunning(process)) {
                return (-2);
            }
            const pid = await this._runner.Start(process);
            this._list.Add(process, pid);
            return pid;
        }
        catch (error) {
            throw new Error(`Could not start process`);
        }
    }
    async Stop(pid) {
        if (this._list.IsRunning(pid)) {
            const result = await this._runner.Stop(pid);
            this._list.Remove(pid);
            return result;
        }
        return false;
    }
    List() {
        return this._list.AllRunning;
    }
};
ProcessesManager = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [ProcessBackgroundRunner_1.ProcessBackgroundRunner,
        ProcessesList_1.ProcessesList])
], ProcessesManager);
exports.ProcessesManager = ProcessesManager;
//# sourceMappingURL=ProcessesManager.js.map