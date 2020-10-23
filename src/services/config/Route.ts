export interface Route
{
    url: string;
    command: string;
    options: string;
}

export interface StaticRoute
{
    url: string;
    dir: string;
}