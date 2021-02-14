import { ProcessArgs } from "./ProcessArgs";


export class Process
{
    constructor(
        public Args: ProcessArgs,
        public Pid: number = (-1)) { }
}
