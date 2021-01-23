export class Task
{
    constructor(
        public id: number,
        public cmd: string,
        public status: string,
        public started: Date) { }
}
