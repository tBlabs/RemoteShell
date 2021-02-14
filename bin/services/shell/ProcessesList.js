"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessesList = void 0;
const Process_1 = require("./Process");
const inversify_1 = require("inversify");
let ProcessesList = class ProcessesList {
    constructor() {
        this.processes = [];
    }
    get AllRunning() {
        return this.processes;
    }
    IsRunning(pid) {
        return this.processes.find(x => x.Pid === pid) !== undefined;
    }
    IsAlreadyRunning(process) {
        return this.processes.find(x => x.Args.Cmd === process.Cmd && x.Args.Wd === process.Wd) !== undefined;
    }
    Add(process, pid) {
        this.processes.push(new Process_1.Process(process, pid));
    }
    Remove(pid) {
        const index = this.processes.findIndex(x => x.Pid === pid);
        this.processes = this.processes.slice(index, 1);
    }
};
ProcessesList = __decorate([
    inversify_1.injectable()
], ProcessesList);
exports.ProcessesList = ProcessesList;
//# sourceMappingURL=ProcessesList.js.map