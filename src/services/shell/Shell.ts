import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import * as shell from 'shelljs';
import { IShell } from './IShell';
import { Types } from '../../IoC/Types';
import { ILogger } from '../logger/ILogger';
import { ExecResult } from './ExecResult';

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

    public RunInBackground(cmd: string, cwd: string)
    {
        const s = spawn('sudo node', ['App1.js'], { stdio: 'ignore',  cwd: '/home/pi/app1', detached: true });
        if (0)
        s.stdout.on('data', (data)=>{
          console.log(data.toString());
        });
        if (0)
        s.stderr.on('data', (data)=>console.log(data.toString()));
        
        console.log('pid', s.pid);
        s.unref();
        
    }
}

export class ProcessesManager
{
    public Start(args: string[], workingDirectory: string)
    {
        _shell.RunInBackground()
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
