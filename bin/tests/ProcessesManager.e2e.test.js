"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const axios_1 = require("axios");
test('should start and stop test App1.js @ Raspbian Lite @ Raspberry Pi Zero', async () => {
    try {
        let response = await axios_1.default.post(`http://192.168.43.229:3000/process/start`, `node App1.js`, { headers: { 'command': `node App1.js`, 'wd': `/home/pi/app1` } });
        const pid = response.data;
        expect(pid).toBeGreaterThan(0);
        response = await axios_1.default.post(`http://192.168.43.229:7001`);
        expect(response.data.length).toBeGreaterThan(1);
    }
    catch (ex) {
        console.log(ex.message);
    }
});
//# sourceMappingURL=ProcessesManager.e2e.test.js.map