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
import { TasksQueue } from './utils/TasksQueue/TasksQueue';
import { ProcessesManager } from "./services/shell/ProcessesManager";
import { ProcessArgs } from './services/shell/ProcessArgs';

@injectable()
export class Main
{
    constructor(
        @inject(Types.ILogger) private _log: ILogger,
        @inject(Types.IConfig) private _config: IConfig,
        private _process: ProcessesManager)
    { }

    public async Run(): Promise<void>
    {
        // await this.AbortIfAppIsAlreadyRunning();
        const tasksQueue = new TasksQueue();

        const server = express();
        server.use(cors({ exposedHeaders: 'Content-Length' }));
        server.use(express.text());

        const hb = new HelpBuilder("RemoteShell", "Command line via http calls")
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
            .Api("/processes", "List background processes")

        server.get('/favicon.ico', (req, res) => res.status(204));

        server.get('/', (req, res) => res.send(hb.ToString()));
        server.get('/ping', (req, res) => res.send('pong'));

        let ind = 0;
        server.get('/queue/waiting', (req, res) => res.send(tasksQueue.ListOfLast100Waiting));
        server.get('/queue/all', (req, res) => res.send(tasksQueue.Last100));

        server.all('/processes', (req, res) =>
        {
            const processes = this._process.List();

            res.send(processes);
        });

        server.all('/process/start', async (req, res) => 
        {
            try
            {
                const cmd = req.headers['cmd'] || req.body;
                const wd = req.headers['wd'] as string || "";

                this._log.Log(`Starting process "${cmd}" @ ${wd}`);

                const pid = await this._process.Start(new ProcessArgs(cmd, wd));

                this._log.Log(`Started @ ${pid}`);

                res.status(200).send(pid.toString());
            }
            catch (ex)
            {
                this._log.Log(ex.message);

                res.status(500).send(ex.message);
            }
        });

        server.all('/process/stop/:pid', async (req, res) => 
        {
            const pid = +req.params.pid;
            const result = await this._process.Stop(pid);

            res.sendStatus(result ? 202 : 500);
        });
        server.all('/processes/stop/all', async (req, res) =>
        {
            this._log.Log('Stopping all...');

            await this._process.StopAll();

            res.sendStatus(200);
        });

        server.get('/console', (req, res) => res.redirect('/clients/console.html'));
        server.use('/clients', express.static(this.ClientsDir));


        this._config.Routes?.forEach((route: Route) => 
        {
            server.all(route.url, async (req, res) => 
            {
                ind += 1;

                const command = ChangeRawCommandPlaceholdersToRequestKeys(route.command, req.params, route.options);
                tasksQueue.Add(ind, command);

                const shell = IoC.get<IShell>(Types.IShell); // TODO: transform to factory, do not take Shell from constructor!

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


        this._config.Statics?.forEach((r: StaticRoute) => 
        {
            server.use(r.url, express.static(r.dir));
        });


        server.use((req, res, next) =>
        {
            res.sendStatus(404);
        });


        server.listen(this._config.ServerPort, () => this._log.Log('Remote Shell started @', this._config.ServerPort));
    }

    public get ClientsDir(): string
    {
        const fullDirBlocks = __dirname.split(path.sep);
        const dir = [
            fullDirBlocks.slice(0, fullDirBlocks.length - 2).join(path.sep)
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
            this._log.Trace('Pinging myself...');
            const selfPingResponse = await Axios.get('http://localhost:' + this._config.ServerPort + '/ping');
            if (selfPingResponse.data === "pong")
            {
                this._log.Trace('App is already running.');
                process.exit(0);
            }
        }
        catch (error)
        {
            this._log.Trace('App not started yet.');
        }
    }

    private ConvertToHtml(text)
    {
        return text.replace(/\n/gi, "<br>")
            .replace(/ /gi, "&nbsp;")
            .replace(/\t/gi, "<span>    </span>")
    }
}
