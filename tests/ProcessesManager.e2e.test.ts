import 'reflect-metadata';
import axios from "axios";
import { Process } from "../src/services/shell/Process";
import { DelayAsync } from './DelayAsync';

let calls = 0;
async function Post<T>(url: string, data?: string, headers?: object): Promise<{ status: number, data: T }>
{
    calls++; 

    try
    {
        // console.log('POST', url, data, headers);
        const response = await axios.post(url, data, { headers, timeout: 5 * 1000 });

        // console.log(response.status, response.data);

        return ({ status: response.status, data: response.data as T });
    }
    catch (ex)
    {
        console.log(`#${calls} EXCEPTION @ ${url}: ${ex.message}`);

        throw new Error(ex.message);
    }
}

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

    let response = await Post(`${remoteShellAddr}/processes/stop/all`);
return
    // Make sure there is processes started   
    response = await Post(`${remoteShellAddr}/processes`);
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
    await DelayAsync(5000);

    // Something should appear on processes list 
    response = await Post<Process[]>(`${remoteShellAddr}/processes`);
    // expect(response.data[0].Args.Cmd).toBe(command);
    // expect(response.data[0].Args.Wd).toBe(workingDirectory);
    // expect(response.data[0].Pid).toBeGreaterThan(0);

    // Check if App1.js is alive 
    response = await Post(`${testAppAddr}/app/name`);
    expect(response.data).toBe('app1');

    // Try stop
    response = await Post(`${remoteShellAddr}/process/stop/${pid}`);
    expect(response.status).toBe(202);

    // Make sure process has been removed from the list
    response = await Post<Process[]>(`${remoteShellAddr}/processes`);
    expect(response).toEqual([]);

    // Make sure App1.js is dead
    await expect(async () => 
    {
        await Post(testAppAddr);
    })
        .rejects.toThrow();

}, 15 * 1000);
 