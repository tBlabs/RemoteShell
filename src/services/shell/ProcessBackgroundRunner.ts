import { injectable, inject } from 'inversify';
import { IShell } from './IShell';
import { Types } from '../../IoC/Types';
import { ProcessArgs } from "./ProcessArgs";


@injectable()
export class ProcessBackgroundRunner
{
    constructor(@inject(Types.IShell) private _shell: IShell) { }

    public async Start(process: ProcessArgs): Promise<number>
    {
        try
        {
            const splitted = process.Cmd?.split(' '); // TODO: usuwanie podwójnych spacji? ale poza rzeczami w apostrofach

            const pid = await this._shell.RunInBackground(splitted, process.Wd);

            return pid;
        }
        catch (error)
        {
            throw new Error(`Could not start process`);
        }
    }

    public async Stop(pid: number): Promise<boolean>
    {
        return (await this._shell.ExecAsync(`sudo kill ${pid}`)).IsSuccess;
    }
}
