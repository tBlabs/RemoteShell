
export function DelayAsync(delayInMs: number): Promise<NodeJS.Timer>
{
    return new Promise((resolve) =>
    {
        return setTimeout(() => resolve(), delayInMs);
    });
}
