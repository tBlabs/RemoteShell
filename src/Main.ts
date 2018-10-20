import { injectable, inject } from 'inversify';
import { Types } from './IoC/Types';
import * as express from 'express';
import { ChangeRawCommandPlaceholdersToRequestKeys } from "./utils/Replace";
import { Route, StaticRoute } from './services/config/Route';
import { IConfig } from "./services/config/IConfig";
import { IExecutor } from "./services/exe/IExecutor";

@injectable()
export class Main
{
    constructor(
        @inject(Types.IConfig) private _config: IConfig,
        @inject(Types.IExecutor) private _exe: IExecutor)
    { }

    public async Run(): Promise<void>
    {
        const server = express();

        server.get('/favicon.ico', (req, res) => res.status(204));


        this._config.Statics.forEach((r: StaticRoute) => 
        {
            server.use(r.url, express.static(r.dir));
        });


        this._config.Routes.forEach((route: Route) => 
        {
            server.all(route.url, async (req, res) => 
            {
                try
                {
                    const rawCommand = route.command;
                    const command = ChangeRawCommandPlaceholdersToRequestKeys(rawCommand, req.params);
                    console.log('Executing:', command);

                    const commandResult = await this._exe.Exe(command);
                    console.log('Result:', commandResult);

                    res.status(200).send(commandResult);
                }
                catch (error)
                {
                    console.log('Executing error:', error);

                    res.status(500).send(error);
                }
            });
        });


        server.use((req, res, next) =>
        {
            res.sendStatus(404);
        });


        server.listen(this._config.ServerPort, () => console.log('Server started at port', this._config.ServerPort));
    }
}
