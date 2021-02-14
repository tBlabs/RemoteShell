import { injectable } from 'inversify';
import { Process } from './Process';
import { ProcessArgs } from './ProcessArgs';
import { ProcessBackgroundRunner } from './ProcessBackgroundRunner';
import { ProcessesList } from './ProcessesList';

@injectable()
export class ProcessesManager
{
    constructor(
        private _runner: ProcessBackgroundRunner,
        private _list: ProcessesList)
    { }

    public async Start(process: ProcessArgs): Promise<number>
    {
        try
        {
            if (this._list.IsAlreadyRunning(process)) 
            {
                return (-2);
            }

            const pid = await this._runner.Start(process);

            this._list.Add(process, pid);

            return pid;
        }
        catch (error)
        {
            throw new Error(`Could not start process`);
        }
    }

    public async Stop(pid: number): Promise<boolean>
    {
        if (this._list.IsRunning(pid))
        {
            const result = await this._runner.Stop(pid);

            this._list.Remove(pid);

            return result;
        }

        return false;
    }

    public List(): Process[]
    {
        return this._list.AllRunning;
    }
}
