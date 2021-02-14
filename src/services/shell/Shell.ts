import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import * as shell from 'shelljs';
import { IShell } from './IShell';
import { Types } from '../../IoC/Types';
import { ILogger } from '../logger/ILogger';
import { ExecResult } from './ExecResult';
import { spawn } from 'child_process';
import { resolve } from 'path';

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
            this._log.Log(`Exec #${id}: ${cmd}`);
            const start = +new Date();

            shell.exec(cmd, (code, stdout, stderr) =>
            {
                const duration = +new Date() - start;

                const result = new ExecResult(cmd, code, stdout, stderr, id, duration);

                this._log.Log(`Result #${id}:`, result.Message, `(took ${result.duration} ms)`);

                resolve(result);
            });
        });
    }

    public async RunInBackground(cmd: string[], wd: string): Promise<number>
    {
        return new Promise((resolve, reject) =>
        {
            const s = spawn(cmd[0], [...cmd.slice(1)], { stdio: 'ignore', cwd: wd, detached: true });
           
            s.on('error', (err) => 
            {
                console.log('PROCESS ERROR', err);
                reject(err);
            
            });
            s.on('close', (code) => 
            {
                console.log(`PROCESS CLOSED`, code, s.pid);
                resolve(s.pid); 
            });
            s.on('spawn', () => 
            {
                console.log(`PROCESS SPAWNED`, s.pid);
                resolve(s.pid); 
            });

            s.unref();
        });
    }
}

@injectable()
export class ProcessesManager
{
    public async List(name: string)
    {
        return (await this._shell.ExecAsync(`pgrep ${name}`)).Message;
    }
    constructor(@inject(Types.IShell) private _shell: IShell)
    { }
    
    public async Stop(pid: number)
    {
        return await this._shell.ExecAsync(`sudo kill ${pid}`);
    }

    public async Start(args: string, workingDirectory: string)
    {
        try
        {
            const splitted = args?.split(' ');

            const pid = await this._shell.RunInBackground(splitted, workingDirectory);
            // console.log('piddd', pid);
            return pid;
        }
        catch (error)
        {
           throw new Error(`Could not start process`);
        }
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
