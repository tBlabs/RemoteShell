import { ExecResult } from "./ExecResult";

export interface IShell 
{
    // Exe(cmd: string): Promise<string>;
    ExecAsync(cmd: string, id): Promise<ExecResult>;
    // Dispose(): void;
}
