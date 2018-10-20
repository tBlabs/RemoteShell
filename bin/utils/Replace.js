"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ChangeRawCommandPlaceholdersToRequestKeys(rawCommand, requestKeys) {
    const keys = Object.keys(requestKeys);
    keys.forEach(key => {
        const regex = new RegExp("\{" + key + "\}");
        rawCommand = rawCommand.replace(regex, requestKeys[key]);
    });
    return rawCommand;
}
exports.ChangeRawCommandPlaceholdersToRequestKeys = ChangeRawCommandPlaceholdersToRequestKeys;
//# sourceMappingURL=Replace.js.map