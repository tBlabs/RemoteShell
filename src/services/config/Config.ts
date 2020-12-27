import * as fs from 'fs';
import { Route } from './Route';
import { StaticRoute } from "./StaticRoute";
import 'reflect-metadata'; 
import { injectable, inject } from 'inversify';
import { Types } from '../../IoC/Types';
import { IStartupArgs } from '../env/IStartupArgs';
import { IConfig } from './IConfig';

@injectable()
export class Config implements IConfig
{
    private config: any;
    
    constructor(@inject(Types.IStartupArgs) private _args: IStartupArgs)
    {
        const configFileDir = this._args.Args.config || './config.json';
        const configFileContent = fs.readFileSync(configFileDir, 'utf8');

        this.config = JSON.parse(configFileContent);
    }    
    
    public get LogsLevel(): number // || operator cannot be used here because it treats 0 as no value
    {
        if (this._args.Args.logsLevel !== undefined)
            return +this._args.Args.logsLevel;
        
        if (this.config.logsLevel !== undefined)
            return this.config.logsLevel;
            
        return 1;
    }

    public get ServerPort(): number
    {
        return this._args.Args.serverPort || this.config.serverPort || 3000;
    }

    public get Routes(): Route[]
    {
        return this.config.routes;  
    }

    public get Statics(): StaticRoute[]
    {
        return this.config.statics;  
    }

    public get Shell(): string
    {
        return this.config.shell || "sh"; // 'sh' for linux, 'powershell' for windows
    }
}