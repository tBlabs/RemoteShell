import { injectable, inject } from 'inversify';
import { Types } from './IoC/Types';
import * as express from 'express';
import { ChangeRawCommandPlaceholdersToRequestKeys } from "./utils/Replace";
import { Route } from './services/config/Route';
import { StaticRoute } from "./services/config/StaticRoute";
import { IConfig } from "./services/config/IConfig";
import { IShell } from "./services/shell/IShell";
import Axios from 'axios';
import { HelpBuilder } from './utils/HelpBuilder';
import { ILogger } from "./services/logger/ILogger";
import * as path from 'path';
import * as cors from 'cors';
import { IoC } from './IoC/IoC';
import * as fs from 'fs';
import { Shell } from './services/shell/Shell';

@injectable()
export class Main
{
    constructor(
        @inject(Types.ILogger) private _logger: ILogger,
        @inject(Types.IConfig) private _config: IConfig,
        @inject(Types.IShell) private _exe: IShell)
    { }

    public async Run(): Promise<void>
    {
        // await this.AbortIfAppIsAlreadyRunning();

        const server = express();
        server.use(cors({ exposedHeaders: 'Content-Length' }));

        const hb = new HelpBuilder("RemoteShell", "Http calls to command line utility")
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


        this._config.Routes?.forEach((route: Route) => 
        {
            server.all(route.url, async (req, res) => 
            {
                let shell;
                try
                {
                    const rawCommand = route.command;
                    const command = ChangeRawCommandPlaceholdersToRequestKeys(rawCommand, req.params, route.options);
                    this._logger.Log('Executing:', command);

                    // let commandResult = await this._exe.Exe(command);
                    // const exe = new Shell(this._config);
                    shell = IoC.get<IShell>(Types.IShell); // TODO: transform to factory

                    let commandResult = await shell.Exe(command);
                    this._logger.Log('Result:', commandResult);

                    if (req.headers.responsetype === "html") // 'responsetype' must be lower-case!!!
                    {
                        commandResult = this.ConvertToHtml(commandResult);
                    }

                    res.status(200).send(commandResult);
                }
                catch (error)
                {
                    this._logger.Log('Execution error:', error);

                    if (req.headers.responsetype === "html") // 'responsetype' must be lower-case!!!
                    {
                        error = this.ConvertToHtml(error);
                    }

                    res.status(500).send(error);
                }
                finally
                {
                    shell.Dispose();
                }
            });
        });


        this._config.Statics?.forEach((r: StaticRoute) => 
        {
            server.use(r.url, express.static(r.dir));
        });


        server.use((req, res, next) =>
        {
            res.sendStatus(404);
        });


        server.listen(this._config.ServerPort, () => this._logger.Log('Remote Shell started @', this._config.ServerPort));
    }

    public get ClientsDir(): string
    {
        const fullDirBlocks = __dirname.split(path.sep);
        const dir = [
            fullDirBlocks.slice(0, fullDirBlocks.length - 1).join(path.sep)
            , 
            'clients'
        ]
            .join(path.sep);
        return dir;
    }

    private async AbortIfAppIsAlreadyRunning()
    {
        try
        {
            this._logger.Trace('Pinging myself...');
            const selfPingResponse = await Axios.get('http://localhost:' + this._config.ServerPort + '/ping');
            if (selfPingResponse.data === "pong")
            {
                this._logger.Trace('App is already running.');
                process.exit(0);
            }
        }
        catch (error)
        {
            this._logger.Trace('App not started yet.');
        }
    }

    private ConvertToHtml(text)
    {
        return text.replace(/\n/gi, "<br>")
            .replace(/ /gi, "&nbsp;")
            .replace(/\t/gi, "<span>    </span>")
    }
}
