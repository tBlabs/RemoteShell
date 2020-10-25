
export interface ILogger
{
    LogEnable: boolean;
    TraceEnable: boolean;
    SetLogLevel(level: number);
    Log(...params): void;
    Trace(...params): void;
    Error(...params): void;
}
