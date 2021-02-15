import 'reflect-metadata';
import { Process } from "../src/services/shell/Process";
import { DelayAsync } from './DelayAsync';
import { Post, Get } from './Post';

/*
    THIS TEST NEEDS FEW THINGS TO PASS:
    - INSTANCE OF THIS APP INSTALLED AND RUNNING ON ANOTHER DEVICE (RASPBERRY PI OR SOMETHING)
    - TEST APP INSTALLED (LIKE App1 FROM https://github.com/tBlabs/App1)
*/
test('should start and stop App1.js @ Raspbian Lite @ Raspberry Pi Zero', async () =>
{
    const remoteShellAddr = `http://192.168.43.229:3000`;
    const testAppAddr = `http://192.168.43.229:7001`;
    const workingDirectory = `/home/pi/App1`;
    const command = 'node App1.js';
    /*
        THIS IS NOT WORKING:

        const cmd = 'npm start'; 
    */
    let response;

    if (0)
    {
        // Clean up

        response = await Get(`${testAppAddr}/app/name`);
        expect(response.data).toBe('app1');

        response = await Post(`${remoteShellAddr}/processes/stop/all`);
    }

    // Make sure there is processes started   
    response = await Get(`${remoteShellAddr}/processes`);
    expect(response.data).toEqual([]);

    // Try to run App1.js
    response = await Post(`${remoteShellAddr}/process/start`, '', { 'command': command, 'wd': workingDirectory });
    /*
        OR 
        
        response = await Post(`${target}/process/start`, cmd, { 'wd': wd, 'Content-Type': 'text/plain' });
    */
    let pid = response.data;
    expect(pid).toBeGreaterThan(0);

    // Give App1.js time to warm up
    await DelayAsync(8000);

    // Something should appear on processes list 
    response = await Get<Process[]>(`${remoteShellAddr}/processes`);
    expect(response.data[0].Args.Cmd).toBe(command);
    expect(response.data[0].Args.Wd).toBe(workingDirectory);
    expect(response.data[0].Pid).toBeGreaterThan(0);

    // Check if App1.js is alive 
    response = await Get(`${testAppAddr}/app/name`);
    expect(response.data).toBe('app1');

    // Try stop
    response = await Post(`${remoteShellAddr}/process/stop/${pid}`);
    expect(response.status).toBe(202);

    // Make sure process has been removed from the list
    response = await Get<Process[]>(`${remoteShellAddr}/processes`);
    expect(response.data).toEqual([]);

    // Make sure App1.js is dead
    await expect(async () => 
    {
        await Post(testAppAddr);
    })
        .rejects.toThrow();

}, 15 * 1000);
