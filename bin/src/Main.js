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
exports.Main = void 0;
const inversify_1 = require("inversify");
const Types_1 = require("./IoC/Types");
const express = require("express");
const Replace_1 = require("./utils/Replace");
const axios_1 = require("axios");
const HelpBuilder_1 = require("./utils/HelpBuilder");
const path = require("path");
const cors = require("cors");
const IoC_1 = require("./IoC/IoC");
const TasksQueue_1 = require("./utils/TasksQueue/TasksQueue");
const ProcessesManager_1 = require("./services/shell/ProcessesManager");
const ProcessArgs_1 = require("./services/shell/ProcessArgs");
let Main = class Main {
    constructor(_log, _config, _process) {
        this._log = _log;
        this._config = _config;
        this._process = _process;
    }
    async Run() {
        var _a, _b;
        // await this.AbortIfAppIsAlreadyRunning();
        const tasksQueue = new TasksQueue_1.TasksQueue();
        const server = express();
        server.use(cors({ exposedHeaders: 'Content-Length' }));
        server.use(express.text());
        const hb = new HelpBuilder_1.HelpBuilder("RemoteShell", "Command line via http calls")
            .Status("Waiting tasks count", () => tasksQueue.ListOfLast100Waiting.length.toString())
            .Status("Consumed tasks so far", () => tasksQueue.TotalCount.toString())
            .Status("Running processes count", () => this._process.List.length.toString())
            //.Config("shell", this._config.Shell, "sh", "sh (for Linux), powershell (for Windows)", "config.json")
            .Config("routes", JSON.stringify(this._config.Routes), "[]", '[{"url": "/test/:param", "command": "echo test {param}"}]', "config.json")
            .Config("serverPort", this._config.ServerPort.toString(), "3000", "1234", "config.json or command line argument 'serverPort' (ex: --serverPort 1234)")
            .Config("statics", JSON.stringify(this._config.Statics), "[]", '[{"url": "/files", "dir": "./shared_files" }]', "config.json")
            .Config("logsLevel", this._config.LogsLevel.toString(), "1", "0 - off, 1 - log, 2 - trace", "config.json or command line argument 'logsLevel' (ex: --logsLevel 2)")
            .Api("/ping", "Always returns 'pong'")
            .Api("/queue/waiting", "Returns list of last 100 waiting tasks")
            .Api("/queue/all", "Returns list of last 100 tasks")
            .Api("/console", "Will redirect /clients/console.html")
            .Api("/clients/console.html", "Simple web client for shell")
            .Api("/{any route}", "Routes and their assigned commands defined in config.json")
            .Api("responsetype header", "Defines if response should be html-formatted or not. Possible options are: html (or just no header)")
            .Api("/process/start", "Starts new background process (regular commands with & will not work). Pass params through headers: cmd (for command), wd (for working directory)")
            .Api("/process/stop/:pid", "Stops background process")
            .Api("/process/stop/all", "Stops all background processes")
            .Api("/processes", "List background processes");
        server.get('/favicon.ico', (req, res) => res.status(204));
        server.get('/', (req, res) => res.send(hb.ToString()));
        server.get('/ping', (req, res) => res.send('pong'));
        let ind = 0;
        server.get('/queue/waiting', (req, res) => res.send(tasksQueue.ListOfLast100Waiting));
        server.get('/queue/all', (req, res) => res.send(tasksQueue.Last100));
        server.all('/processes', (req, res) => {
            const processes = this._process.List();
            res.send(processes);
        });
        server.all('/process/start', async (req, res) => {
            try {
                const cmd = req.headers['cmd'] || req.body;
                const wd = req.headers['wd'] || "";
                this._log.Log(`Starting process "${cmd}" @ ${wd}`);
                const pid = await this._process.Start(new ProcessArgs_1.ProcessArgs(cmd, wd));
                this._log.Log(`Started @ ${pid}`);
                res.status(200).send(pid.toString());
            }
            catch (ex) {
                this._log.Log(ex.message);
                res.status(500).send(ex.message);
            }
        });
        server.all('/process/stop/:pid', async (req, res) => {
            const pid = +req.params.pid;
            const result = await this._process.Stop(pid);
            res.sendStatus(result ? 202 : 500);
        });
        server.all('/processes/stop/all', async (req, res) => {
            this._log.Log('Stopping all...');
            await this._process.StopAll();
            res.sendStatus(200);
        });
        server.get('/console', (req, res) => res.redirect('/clients/console.html'));
        server.use('/clients', express.static(this.ClientsDir));
        (_a = this._config.Routes) === null || _a === void 0 ? void 0 : _a.forEach((route) => {
            server.all(route.url, async (req, res) => {
                ind += 1;
                const command = Replace_1.ChangeRawCommandPlaceholdersToRequestKeys(route.command, req.params, route.options);
                tasksQueue.Add(ind, command);
                const shell = IoC_1.IoC.get(Types_1.Types.IShell); // TODO: transform to factory, do not take Shell from constructor!
                let result = await shell.ExecAsync(command, ind);
                tasksQueue.Remove(result.id);
                if (req.headers.responsetype === "html") // 'responsetype' must be lower-case!!!
                 {
                    result = this.ConvertToHtml(result.Message);
                }
                res.status(result.IsSuccess ? 200 : 500)
                    .send(result.Message);
            });
        });
        (_b = this._config.Statics) === null || _b === void 0 ? void 0 : _b.forEach((r) => {
            server.use(r.url, express.static(r.dir));
        });
        server.use((req, res, next) => {
            res.sendStatus(404);
        });
        server.listen(this._config.ServerPort, () => this._log.Log('Remote Shell started @', this._config.ServerPort));
    }
    get ClientsDir() {
        const fullDirBlocks = __dirname.split(path.sep);
        const dir = [
            fullDirBlocks.slice(0, fullDirBlocks.length - 2).join(path.sep),
            'clients'
        ]
            .join(path.sep);
        console.log(dir);
        return dir;
    }
    async AbortIfAppIsAlreadyRunning() {
        try {
            this._log.Trace('Pinging myself...');
            const selfPingResponse = await axios_1.default.get('http://localhost:' + this._config.ServerPort + '/ping');
            if (selfPingResponse.data === "pong") {
                this._log.Trace('App is already running.');
                process.exit(0);
            }
        }
        catch (error) {
            this._log.Trace('App not started yet.');
        }
    }
    ConvertToHtml(text) {
        return text.replace(/\n/gi, "<br>")
            .replace(/ /gi, "&nbsp;")
            .replace(/\t/gi, "<span>    </span>");
    }
};
Main = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.ILogger)),
    __param(1, inversify_1.inject(Types_1.Types.IConfig)),
    __metadata("design:paramtypes", [Object, Object, ProcessesManager_1.ProcessesManager])
], Main);
exports.Main = Main;
//# sourceMappingURL=Main.js.map