"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const axios_1 = require("axios");
test('should start and stop test App1.js @ Raspbian Lite @ Raspberry Pi Zero', async () => {
    try {
        // Make sure there is processes started 
        let response = await axios_1.default.get(`http://192.168.43.229:3000/processes`);
        expect(response.data).toEqual([]);
        // Try to run App1.js
        response = await axios_1.default.post(`http://192.168.43.229:3000/process/start`, `node App1.js`, { headers: { 'command': `node App1.js`, 'wd': `/home/pi/app1` } });
        let pid = response.data;
        expect(pid).toBeGreaterThan(0);
        // Try stop
        response = await axios_1.default.post(`http://192.168.43.229:3000/process/stop/${pid}`);
        expect(response.status).toBe(202);
        // Check if process appeared on the list
        // response = await axios.get(`http://192.168.43.229:3000/processes`);
        // expect(response.data[0].Args.Cmd).toEqual('node App1.js');
        // response = await axios.get(`http://192.168.43.229:7001`);
        // expect(response.data.length).toBeGreaterThan(1);
    }
    catch (ex) {
        console.log(ex.message);
        expect(true).toBeFalsy();
    }
});
//# sourceMappingURL=ProcessesManager.e2e.test.js.map