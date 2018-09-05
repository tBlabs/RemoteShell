import { spawn } from 'child_process';

export class Exe
{
    public async Exe(cmd: string): Promise<string> 
    {
        return new Promise<string>((resolve, reject) => 
        {
            const chunks = cmd.split(' ');
            const app = chunks[0];
            const args = chunks.splice(1);

            const process = spawn(app, args);

            process.stdout.on('data', (data) =>
            {
                resolve(data.toString());
            });

            process.stderr.on('data', (data) =>
            {
                reject(data.toString());
            });

            process.on('error', (error: Error) =>
            {
                reject(error.toString());
            });
        });
    };
}
