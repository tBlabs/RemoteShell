
export class ExecResult
{
    constructor(public command: string,
        public code: number,
        public stdout: string,
        public stderr: string,
        public id: string | number,
        public duration: number) { }

    public get Command(): string
    {
        return this.command;
    }

    public get IsSuccess(): boolean
    {
        return this.code === 0;
    }

    public get StdOut(): string
    {
        return this.stdout?.toString()?.trim() ?? "";
    }

    public get StdErr(): string
    {
        return this.stderr?.toString()?.trim() ?? "";
    }

    public get Message(): string
    {
        return this.StdOut?.length ? this.StdOut : this.StdErr;
    }
}
