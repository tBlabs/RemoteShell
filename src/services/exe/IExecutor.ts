export interface IExecutor 
{
    Exe(cmd: string): Promise<string>;
}
