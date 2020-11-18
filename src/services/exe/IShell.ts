export interface IShell 
{
    Exe(cmd: string): Promise<string>;
}
