import { LogEntry } from './LogEntry';

export class LoggerConfig
{
    public output: (entry: LogEntry) => void = (entry: LogEntry) => console.log(entry.message);
}
