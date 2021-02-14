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
        // return new Promise((resolve, reject) =>
        // {
            const s = spawn(cmd[0], [...cmd.slice(1)], { stdio: 'ignore', cwd: wd, detached: true });
           
            s.on('error', (err) => 
            {
                console.log('PROCESS ERROR', err);
                // reject(err);
            
            });
            s.on('close', (code) => 
            {
                console.log(`PROCESS CLOSED`, code, s.pid);
                // resolve(s.pid); 
            });
            s.on('spawn', () => 
            {
                console.log(`PROCESS SPAWNED`, s.pid);
                // resolve(s.pid); 
            });

            s.unref();

            return s.pid;
        // });
    }
}
