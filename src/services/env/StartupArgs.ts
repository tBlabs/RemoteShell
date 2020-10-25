import 'reflect-metadata';
import { injectable } from 'inversify';
import { IStartupArgs } from './IStartupArgs';
import * as minimist from 'minimist';

@injectable()
export class StartupArgs implements IStartupArgs
{
    private readonly args: minimist.ParsedArgs;

    constructor()
    {
        this.args = minimist(this.RawArgs);
    }

    public get RawArgs(): string[]
    {
        return process.argv.slice(2);
    }

    public get Args(): minimist.ParsedArgs
    {
        return this.args;
    }
}
