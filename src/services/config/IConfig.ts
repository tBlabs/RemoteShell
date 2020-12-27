import { Route } from "./Route";
import { StaticRoute } from "./StaticRoute";

export interface IConfig
{
    LogsLevel: number;
    ServerPort: number;
    Routes: Route[];
    Statics: StaticRoute[];
    Shell: string;
}
