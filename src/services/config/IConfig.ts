import { Route, StaticRoute } from "./Route";

export interface IConfig
{
    ServerPort: number;
    Routes: Route[];
    Statics: StaticRoute[];
    Shell: string;
}
