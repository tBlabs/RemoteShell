"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksQueue = void 0;
class TasksQueue {
    constructor() {
        this.list = [];
    }
    Add(id, cmd) {
        if (this.list.length > 100)
            this.list.shift();
        this.list.push({ id, cmd, status: "waiting", started: new Date() });
    }
    Remove(id) {
        const e = this.list.find(x => x.id === id);
        if (e === undefined)
            return;
        e.status = "executed in " + (+new Date() - +e.started) + " ms";
    }
    get ListOfLast100Waiting() {
        return this.list.filter(x => x.status === "waiting");
    }
    get Last100() {
        return this.list;
    }
}
exports.TasksQueue = TasksQueue;
//# sourceMappingURL=TasksQueue.js.map