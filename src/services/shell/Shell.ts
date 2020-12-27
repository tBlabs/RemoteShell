// import 'reflect-metadata';
// import { IShell } from "./IShell";
// import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
// import { inject, injectable } from "inversify";
// import { IConfig } from "../config/IConfig";
// import { Types } from "../../IoC/Types";

import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import * as shell from 'shelljs';
// import { ExecResult } from './ExecResult';
import { IShell } from './IShell';
import { Types } from '../../IoC/Types';
import { ILogger } from '../logger/ILogger';

export class ExecResult
{
    constructor(public command: string, public code: number, public stdout: string, public stderr: string) { }
   
    public get Command(): string
    {
        return this.command;
    }

    public get IsSuccess(): boolean
    {
        return this.code === 0;
    }

    public get StdOut(): string
    {
        return this.stdout?.toString()?.trim() ?? "";
    }

    public get StdErr(): string
    {
        return this.stderr?.toString()?.trim() ?? "";
    }

    public get Message(): string
    {
        return this.StdOut?.length ? this.StdOut : this.StdErr;
    }
}

@injectable()
export class Shell implements IShell
{
    constructor(@inject(Types.ILogger) private _log: ILogger)
    {
        shell.config.silent = true;
    }

    public ExecAsync(cmd: string, id): Promise<ExecResult>
    {
        return new Promise((resolve, reject) =>
        {
            this._log.Log(`Exec ${id}: ${cmd}`);

            shell.exec(cmd, (code, stdout, stderr) =>
            {
                const result = new ExecResult(cmd, code, stdout, stderr);

                this._log.Log(`Result ${id}:`, result.Message);

                resolve(result);
            });
        });
    }
}

// @injectable()
// export class Shell implements IShell
// {
//     constructor(@inject(Types.IConfig) private _config: IConfig)
//     { }

//     private process!: ChildProcessWithoutNullStreams;

//     public Dispose()//???????///
//     {
//         this.process.stdout.removeAllListeners();
//         this.process.stderr.removeAllListeners();
//         this.process.removeAllListeners();
//     }

//     public async Exe(rawCmd: string): Promise<string> 
//     {
//         return new Promise<string>((resolve, reject) => 
//         {
//             this.process = spawn(this._config.Shell, ['-c', rawCmd], { detached: false } );

//             let response = "";
//             let isErr = false;

//             this.process.stdout.on('data', (data) =>
//             {
//                 response += data.toString();
//             });

//             this.process.stderr.on('data', (data) =>
//             {
//                 response += data.toString();
//                 isErr = true;
//             });

//             this.process.stderr.on('end', () =>
//             {
//                 if (isErr) 
//                 {
//                     reject(response);
//                 }
//                 else 
//                 {
//                     resolve(response);
//                 }
//             });

//             this.process.on('error', (error: Error) =>
//             {
//                 reject('ERROR: ' + error);
//             });

//             this.process.on('close', (code, signal) =>
//             {
//                 reject('CLOSE: ' + code.toString() + ' ' + signal);
//             });

//             this.process.on('disconnect', () =>
//             {
//                 reject('DISCONNECT');
//             });

//             this.process.on('exit', (code, signal) =>
//             {
//                 /* do nothing, especially do not reject here */
//                 if (isErr) //???????????????????????????????????????
//                 {
//                     reject(response);
//                 }
//                 else 
//                 {
//                     resolve(response);
//                 }
//             });

//             this.process.on('message', (msg) =>
//             {
//                 reject('MESSAGE: ' + msg);
//             });
//         });
//     };
// }
