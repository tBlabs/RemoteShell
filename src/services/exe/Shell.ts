import 'reflect-metadata';
import { IShell } from "./IShell";
import { spawn } from 'child_process';
import { inject, injectable } from "inversify";
import { IConfig } from "../config/IConfig";
import { Types } from "../../IoC/Types";

@injectable()
export class Shell implements IShell
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
                reject('ERROR: ' + error);
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
                /* do nothing, especially do not reject here */
            });

            process.on('message', (msg) =>
            {
                reject('MESSAGE: ' + msg);
            });
        });
    };
}
