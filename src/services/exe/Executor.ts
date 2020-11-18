import 'reflect-metadata';
import { IExecutor } from "./IExecutor";
import { spawn } from 'child_process';
import { inject, injectable } from "inversify";
import { IConfig } from "../config/IConfig";
import { Types } from "../../IoC/Types";

@injectable()
export class Executor implements IExecutor
{
    constructor(@inject(Types.IConfig) private _config: IConfig)
    { }

    public async Exe(rawCmd: string): Promise<string> 
    {
        return new Promise<string>((resolve, reject) => 
        {
            const process = spawn(this._config.Shell, ['-c', rawCmd]);

            let response = "";
            let isErr = false;

            process.stdout.on('data', (data) =>
            {
                response += data.toString();
            });

            process.stderr.on('data', (data) =>
            {
                response += data.toString();
                isErr = true;
            });

            process.stderr.on('end', () =>
            {
                if (isErr) 
                {
                    reject(response);
                }
                else 
                {
                    resolve(response);
                }
            });

            process.on('error', (error: Error) =>
            {
                reject('ERROR: ' + error.toString());
            });

            process.on('close', (code, signal) =>
            {
                reject('CLOSE: ' + code.toString() + ' ' + signal);
            });

            process.on('disconnect', () =>
            {
                reject('DISCONNECT');
            });

            process.on('exit', (code, signal) =>
            {
                reject('EXIT: ' + code?.toString() + ', SIGNAL: ' + signal);
            });

            process.on('message', (msg) =>
            {
                reject('MESSAGE: ' + msg);
            });
        });
    };
}
