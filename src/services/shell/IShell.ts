import { ExecResult } from "./ExecResult";

export interface IShell 
{
    ExecAsync(cmd: string, id?): Promise<ExecResult>;
    RunInBackground(cmd: string[], wd: string): Promise<number>;
}
