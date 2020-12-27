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
let Main = class Main {
    constructor(_logger, _config, _exe) {
        this._logger = _logger;
        this._config = _config;
        this._exe = _exe;
    }
    async Run() {
        // await this.AbortIfAppIsAlreadyRunning();
        var _a, _b;
        const server = express();
        server.use(cors({ exposedHeaders: 'Content-Length' }));
        const hb = new HelpBuilder_1.HelpBuilder("RemoteShell", "Http calls to command line utility")
            .Config("shell", this._config.Shell, "sh", "sh (for Linux), powershell (for Windows)", "config.json")
            .Config("routes", JSON.stringify(this._config.Routes), "[]", '[{"url": "/test/:param", "command": "echo test {param}"}]', "config.json")
            .Config("serverPort", this._config.ServerPort.toString(), "3000", "1234", "config.json or command line argument 'serverPort' (ex: --serverPort 1234)")
            .Config("statics", JSON.stringify(this._config.Statics), "[]", '[{"url": "/files", "dir": "./shared_files" }]', "config.json")
            .Config("logsLevel", this._config.LogsLevel.toString(), "1", "0 - off, 1 - log, 2 - trace", "config.json or command line argument 'logsLevel' (ex: --logsLevel 2)")
            .Api("/ping", "Always returns 'pong'")
            .Api("/console", "Will redirect /clients/console.html")
            .Api("/clients/console.html", "Simple web client for shell")
            .Api("/{any route}", "Routes and their assigned commands defined in config.json")
            .Api("responsetype header", "Defines if response should be html-formatted or not. Possible options are: html (or just no header)");
        server.get('/favicon.ico', (req, res) => res.status(204));
        server.get('/', (req, res) => res.send(hb.ToString()));
        server.get('/ping', (req, res) => res.send('pong'));
        server.get('/console', (req, res) => res.redirect('/clients/console.html'));
        server.use('/clients', express.static(this.ClientsDir));
        (_a = this._config.Routes) === null || _a === void 0 ? void 0 : _a.forEach((route) => {
            server.all(route.url, async (req, res) => {
                let shell;
                try {
                    const rawCommand = route.command;
                    const command = Replace_1.ChangeRawCommandPlaceholdersToRequestKeys(rawCommand, req.params, route.options);
                    this._logger.Log('Executing:', command);
                    // let commandResult = await this._exe.Exe(command);
                    // const exe = new Shell(this._config);
                    shell = IoC_1.IoC.get(Types_1.Types.IShell); // TODO: transform to factory
                    let commandResult = await shell.Exe(command);
                    this._logger.Log('Result:', commandResult);
                    if (req.headers.responsetype === "html") // 'responsetype' must be lower-case!!!
                     {
                        commandResult = this.ConvertToHtml(commandResult);
                    }
                    res.status(200).send(commandResult);
                }
                catch (error) {
                    this._logger.Log('Execution error:', error);
                    if (req.headers.responsetype === "html") // 'responsetype' must be lower-case!!!
                     {
                        error = this.ConvertToHtml(error);
                    }
                    res.status(500).send(error);
                }
                finally {
                    shell.Dispose();
                }
            });
        });
        (_b = this._config.Statics) === null || _b === void 0 ? void 0 : _b.forEach((r) => {
            server.use(r.url, express.static(r.dir));
        });
        server.use((req, res, next) => {
            res.sendStatus(404);
        });
        server.listen(this._config.ServerPort, () => this._logger.Log('Remote Shell started @', this._config.ServerPort));
    }
    get ClientsDir() {
        const fullDirBlocks = __dirname.split(path.sep);
        const dir = [
            fullDirBlocks.slice(0, fullDirBlocks.length - 1).join(path.sep),
            'clients'
        ]
            .join(path.sep);
        return dir;
    }
    async AbortIfAppIsAlreadyRunning() {
        try {
            this._logger.Trace('Pinging myself...');
            const selfPingResponse = await axios_1.default.get('http://localhost:' + this._config.ServerPort + '/ping');
            if (selfPingResponse.data === "pong") {
                this._logger.Trace('App is already running.');
                process.exit(0);
            }
        }
        catch (error) {
            this._logger.Trace('App not started yet.');
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
    __param(2, inversify_1.inject(Types_1.Types.IShell)),
    __metadata("design:paramtypes", [Object, Object, Object])
], Main);
exports.Main = Main;
//# sourceMappingURL=Main.js.map