"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeRawCommandPlaceholdersToRequestKeys = void 0;
function ChangeRawCommandPlaceholdersToRequestKeys(rawCommand, requestKeys, options) {
    const keys = Object.keys(requestKeys);
    keys.forEach(key => {
        const regex = new RegExp("\{" + key + "\}");
        if (options === "Base64Params") {
            const reqKey = requestKeys[key];
            let buff = Buffer.from(reqKey, 'base64');
            let k = buff.toString();
            rawCommand = rawCommand.replace(regex, k);
        }
        else {
            rawCommand = rawCommand.replace(regex, requestKeys[key]);
        }
    });
    return rawCommand;
}
exports.ChangeRawCommandPlaceholdersToRequestKeys = ChangeRawCommandPlaceholdersToRequestKeys;
//# sourceMappingURL=Replace.js.map