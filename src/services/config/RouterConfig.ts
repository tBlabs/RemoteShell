import * as fs from 'fs';
import { IRouterConfig } from './IRouterConfig';
import { Route } from './Route';
import 'reflect-metadata'; 
import { injectable } from 'inversify';

@injectable()
export class RouterConfig implements IRouterConfig
{
    public get Routes(): Route[]
    {
        const configFileContent = fs.readFileSync('./config.json', 'utf8');
        
        return JSON.parse(configFileContent);
    }
}