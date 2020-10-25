import { Route, StaticRoute } from "./Route";

export interface IConfig
{
    LogsLevel: number;
    ServerPort: number;
    Routes: Route[];
    Statics: StaticRoute[];
    Shell: string;
}
