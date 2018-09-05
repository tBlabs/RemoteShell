import { ILogger } from './services/logger/ILogger';
import { injectable, inject } from 'inversify';
import { Types } from './IoC/Types';
import { IStartupArgs } from './services/environment/IStartupArgs';
import * as express from 'express';
import { Exe } from './services/exe/Exe';
import { IRouterConfig } from './services/config/IRouterConfig';
import { Route } from './services/config/Route';

function Replace(str, params)
{
    const keys = Object.keys(params);

    keys.forEach(k =>
    {
        const regex = new RegExp("\{" + k + "\}");

        str = str.replace(regex, params[k]);
    });

    return str;
}

@injectable()
export class Main
{
    constructor(
        @inject(Types.IStartupArgs) private _args: IStartupArgs,
        @inject(Types.IRouterConfig) private _config: IRouterConfig,
        @inject(Types.ILogger) private _log: ILogger)
    { }

    public async Run(): Promise<void>
    {
        this._log.Info('Main.Run', 'Start args:', this._args.Args); // Don't Try it with "npm run run --foo bar" or "npm run run -- --foo bar", it won't work! Call script directly: "tsc || /bin/startup.js --foo bar"

        const exe = new Exe();

        const server = express();

        this._config.Routes.forEach((r: Route) => 
        {
            server.all(r.url, async (req, res) => 
            {
                const action = Replace(r.action, req.params);

                try
                {
                    const result = await exe.Exe(action);

                    res.status(200).send(result);
                }
                catch (error)
                {
                    res.status(500).send(error);
                }
            });
        });

        server.use((req, res, next) =>
        {
            res.sendStatus(404);
        });

        server.listen(3000, () => console.log('RDY'));
    }
}
