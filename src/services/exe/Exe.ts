import { spawn } from 'child_process';

export class Exe
{
    public async Exe(cmd: string): Promise<string> 
    {
        return new Promise<string>((resolve, reject) => 
        {
            const args = cmd.split(' ').splice(1);
            console.log(args);
            const ls = spawn(cmd, args);

            ls.stdout.on('data', (data) => {
                resolve(data.toString());
            });

            ls.stderr.on('data', (data) => {
                resolve(data.toString());
            });

            ls.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
                reject(code);
            });
        });
    };
}
