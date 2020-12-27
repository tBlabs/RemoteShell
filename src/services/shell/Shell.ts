import 'reflect-metadata';
import { IShell } from "./IShell";
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { inject, injectable } from "inversify";
import { IConfig } from "../config/IConfig";
import { Types } from "../../IoC/Types";

@injectable()
export class Shell implements IShell
{
    constructor(@inject(Types.IConfig) private _config: IConfig)
    { }

    private process: ChildProcessWithoutNullStreams;

    public Dispose()
    {
        this.process.stdout.removeAllListeners();
        this.process.stderr.removeAllListeners();
        this.process.removeAllListeners();
    }

    public async Exe(rawCmd: string): Promise<string> 
    {
        return new Promise<string>((resolve, reject) => 
        {
            this.process = spawn(this._config.Shell, ['-c', rawCmd], { detached: false } );

            let response = "";
            let isErr = false;

            this.process.stdout.on('data', (data) =>
            {
                response += data.toString();
            });

            this.process.stderr.on('data', (data) =>
            {
                response += data.toString();
                isErr = true;
            });

            this.process.stderr.on('end', () =>
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

            this.process.on('error', (error: Error) =>
            {
                reject('ERROR: ' + error);
            });

            this.process.on('close', (code, signal) =>
            {
                reject('CLOSE: ' + code.toString() + ' ' + signal);
            });

            this.process.on('disconnect', () =>
            {
                reject('DISCONNECT');
            });

            this.process.on('exit', (code, signal) =>
            {
                /* do nothing, especially do not reject here */
                if (isErr) //???????????????????????????????????????
                {
                    reject(response);
                }
                else 
                {
                    resolve(response);
                }
            });

            this.process.on('message', (msg) =>
            {
                reject('MESSAGE: ' + msg);
            });
        });
    };
}
