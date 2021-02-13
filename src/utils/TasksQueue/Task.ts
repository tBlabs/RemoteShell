export class Task
{
    constructor(
        public id: string | number,
        public cmd: string,
        public status: string,
        public started: Date) { }
}
