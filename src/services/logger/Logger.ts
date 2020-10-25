import { inject, injectable } from 'inversify';
import { Types } from '../../IoC/Types';
import { IConfig } from '../config/IConfig';
import { ILoggerOutput } from './ILoggerOutput';
import { ILogger } from './ILogger';

@injectable()
export class Logger implements ILogger
{
    public LogEnable: boolean = true;
    public TraceEnable: boolean = true;

    constructor(
        @inject(Types.IConfig) _config: IConfig,
        @inject(Types.ILoggerOutput) private _output: ILoggerOutput)
    { 
        this.SetLogLevel(_config.LogsLevel);
    }

    public SetLogLevel(level: number)
    {
        switch (level)
        {
            case 0:
                this.LogEnable = false;
                this.TraceEnable = false;
                break;
            case 1:
                this.LogEnable = true;
                this.TraceEnable = false;
                break;
            case 2:
                this.LogEnable = true;
                this.TraceEnable = true;
                break;
        }
    }

    public Log(...params: any[]): string
    {
        if (this.LogEnable)
        {
            const str = params.map(this.ObjectToString).join(' ');
            this._output.Print(str);

            return str;
        }
        else return '';
    }

    public Trace(...params: any[]): string
    {
        if (this.TraceEnable)
        {
            return this.Log('  ', ...params);
        }
        else return '';
    }

    public Error(...params: any[]): void
    {
        const str = params.map(this.ObjectToString).join(' ');
        this._output.Print(str);
    }

    private ObjectToString(obj: any): string
    {
        if (obj.constructor === String)
        {
            return obj.replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r')
                .replace(/\t/g, '\\t');
            // return obj.replace(/\n/g, '<NL>')
            //     .replace(/\r/g, '<CR>')
            //     .replace(/\t/g, '<TAB>');
        }
        else
            if (obj === undefined)
            {
                return 'undefined';
            }
            else if (obj === null)
            {
                return 'null';
            }
            else if (obj instanceof Object)
            {
                return JSON.stringify(obj)
                    .replace(/{"/g, "{ ")
                    .replace(/}/g, " }")
                    .replace(/,"/g, ", ")
                    .replace(/":/g, ": ");
            }
            else
            {
                return obj;
            }
    }
}


// @injectable()
// export class OldLogger implements ILogger
// {
//     private config: LoggerConfig = new LoggerConfig();

//     public Config(config: LoggerConfig)
//     {
//         this.config = config;
//     }

//     private TimeMark(time: Date): string
//     {
//         return (time.toLocaleTimeString());
//     }

//     private ObjectToString(obj: any): string
//     {
//         if (obj === undefined)
//         {
//             return 'undefined';
//         }
//         else
//             if (obj === null)
//             {
//                 return 'null';
//             }
//             else
//                 if (obj instanceof Object)
//                 {
//                     return JSON.stringify(obj);
//                 }
//                 else
//                 {
//                     return obj;
//                 }
//     }

//     private ArgsToString(args: any[]): string
//     {
//         return args.map(i => this.ObjectToString(i)).join(' ');
//     }

//     private Message(type: LogType, path: string, time: Date, args: any[]): string
//     {
//         return `[${ type } in ${ path }] ${ this.ArgsToString(args) } @ ${ this.TimeMark(time) }`;
//     }

//     private BuildEntry(type: LogType, path: string, ...args): LogEntry
//     {
//         const entry: LogEntry = new LogEntry();

//         entry.type = type;
//         entry.path = path;
//         entry.args = args;
//         entry.time = new Date();
//         entry.message = this.Message(type, path, entry.time, args);

//         return entry;
//     }

//     private SendEntry(entry: LogEntry): void
//     {
//         if ((this.config !== undefined) && this.config.output)
//         {
//             this.config.output(entry);
//         }
//         else
//         {
//             console.log('[' + Logger.name + '] No log output specified');
//         }
//     }

//     private BuildEntryAndSend(type: LogType, path: string, ...args): void
//     {
//         const entry: LogEntry = this.BuildEntry(type, path, ...args);

//         this.SendEntry(entry);
//     }

//     public Info(path: string, ...args: any[]): void
//     {
//         this.BuildEntryAndSend(LogType.Info, path, ...args);
//     }

//     public Warn(path: string, ...args: any[]): void
//     {
//         this.BuildEntryAndSend(LogType.Warning, path, ...args);
//     }

//     public Ex(path: string, ...args: any[]): void
//     {
//         this.BuildEntryAndSend(LogType.Exception, path, ...args);
//     }
// }
