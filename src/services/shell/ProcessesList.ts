import { ProcessArgs } from "./ProcessArgs";
import { Process } from "./Process";
import { injectable } from "inversify";

@injectable()
export class ProcessesList
{
    private processes: Process[] = [];

    public get AllRunning(): Process[]
    {
        return this.processes;
    }

    public IsRunning(pid: number): boolean
    {
        return this.processes.find(x => x.Pid === pid) !== undefined;
    }

    public IsAlreadyRunning(process: ProcessArgs): boolean
    {
        return this.processes.find(x => x.Args.Cmd === process.Cmd && x.Args.Wd === process.Wd) !== undefined;
    }

    public Add(process: ProcessArgs, pid: number): void
    {
        this.processes.push(new Process(process, pid));
    }

    public Remove(pid: number): void
    {
        const index = this.processes.findIndex(x => x.Pid === pid);

        this.processes.splice(index, 1);
    }
}
