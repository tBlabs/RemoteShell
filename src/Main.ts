import { Replace } from "./utils/Replace";
import { injectable, inject } from 'inversify';
import { Types } from './IoC/Types';
import * as express from 'express';
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


        this._config.Statics.forEach((r: StaticRoute) => 
        {
            server.use(r.url, express.static(r.dir));
        });


        this._config.Routes.forEach((r: Route) => 
        {
            server.all(r.url, async (req, res) => 
            {
                const action = Replace(r.action, req.params);

                try
                {
                    const result = await this._exe.Exe(action);

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


        server.listen(this._config.ServerPort, () => console.log('Server started at port', this._config.ServerPort));
    }
}
