import { IRunMode } from './services/runMode/IRunMode';
import { ILogger } from './services/logger/ILogger';
import { injectable, inject } from 'inversify';
import { Types } from './IoC/Types';
import { IStartupArgs } from './services/environment/IStartupArgs';
import * as express from 'express';
import * as fs from 'fs';
import { Exe } from './services/exe/Exe';

interface Route {
    url: string;
    action: string;
}



@injectable()
export class Main {
    constructor(
        @inject(Types.IStartupArgs) private _args: IStartupArgs,
        @inject(Types.ILogger) private _log: ILogger,
        @inject(Types.IRunMode) private _runMode: IRunMode) { }

    public async Run(): Promise<void> {
        this._log.Info('Main.Run', 'Starting in "' + this._runMode.Current + '" mode with args:', this._args.Args); // Don't Try it with "npm run run --foo bar" or "npm run run -- --foo bar", it won't work! Call script directly: "tsc || /bin/startup.js --foo bar"


        const exe = new Exe();
        const res = await exe.Exe('dir');
        console.log(res);

        const content = fs.readFileSync('./config.json', 'utf8');
        const obj = JSON.parse(content);
        const routes: Route[] = obj;

        console.log(routes[0]);

        const server = express();

        

        routes.forEach(r => server.all(r.url, async (req, res) => 
        {
            console.log(req.params);
            console.log(Object.keys(req.params));
            r.action.replace(, )
            // const result = await exe.Exe(action);
            // res.send(result);
            res.send("...");
        }));

        server.listen(3000, () => console.log('RDY'));
    }
}
