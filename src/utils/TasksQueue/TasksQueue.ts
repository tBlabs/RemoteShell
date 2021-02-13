import { Task } from "./Task";

export class TasksQueue
{
    private list: Task[] = [];
    private totalCounter = 0;

    public Add(id: string | number, cmd: string): void
    {
        if (this.list.length > 100)
            this.list.shift();

        this.totalCounter += 1;

        this.list.push({ id, cmd, status: "waiting", started: new Date() });
    }

    public Remove(id: string | number): void
    {
        const e = this.list.find(x => x.id === id);
        if (e === undefined)
            return;
        e.status = "executed in " + (+new Date() - +e.started) + " ms";
    }

    public get ListOfLast100Waiting(): Task[]
    {
        return this.list.filter(x => x.status === "waiting");
    }

    public get Last100(): Task[]
    {
        return this.list;
    }

    public get TotalCount(): number
    {
        return this.totalCounter;
    }
}
