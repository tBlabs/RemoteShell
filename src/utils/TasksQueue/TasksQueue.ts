import { Task } from "./Task";

export class TasksQueue
{
    private list: Task[] = [];

    public Add(id: number, cmd: string): void
    {
        if (this.list.length > 100)
            this.list.shift();

        this.list.push({ id, cmd, status: "waiting", started: new Date() });
    }

    public Remove(id: number): void
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
}
