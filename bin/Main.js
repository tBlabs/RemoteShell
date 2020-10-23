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
const inversify_1 = require("inversify");
const Types_1 = require("./IoC/Types");
const express = require("express");
const Replace_1 = require("./utils/Replace");
let Main = class Main {
    constructor(_config, _exe) {
        this._config = _config;
        this._exe = _exe;
    }
    async Run() {
        const server = express();
        server.get('/favicon.ico', (req, res) => res.status(204));
        this._config.Statics.forEach((r) => {
            server.use(r.url, express.static(r.dir));
        });
        this._config.Routes.forEach((route) => {
            server.all(route.url, async (req, res) => {
                try {
                    const rawCommand = route.command;
                    const command = Replace_1.ChangeRawCommandPlaceholdersToRequestKeys(rawCommand, req.params, route.options);
                    console.log('Executing:', command);
                    let commandResult = await this._exe.Exe(command);
                    console.log('Result:', commandResult);
                    if (req.headers.responsetype === "html") {
                        commandResult = this.ConvertToHtml(commandResult);
                    }
                    res.status(200).send(commandResult);
                }
                catch (error) {
                    console.log('Executing error:', error);
                    if (req.headers.responsetype === "html") {
                        error = this.ConvertToHtml(error);
                    }
                    res.status(500).send(error);
                }
            });
        });
        server.use((req, res, next) => {
            res.sendStatus(404);
        });
        server.listen(this._config.ServerPort, () => console.log('Server started at port', this._config.ServerPort));
    }
    ConvertToHtml(text) {
        return text.replace(/\n/gi, "<br>")
            .replace(/ /gi, "&nbsp;")
            .replace(/\t/gi, "<span>    </span>");
    }
};
Main = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.IConfig)),
    __param(1, inversify_1.inject(Types_1.Types.IExecutor)),
    __metadata("design:paramtypes", [Object, Object])
], Main);
exports.Main = Main;
//# sourceMappingURL=Main.js.map