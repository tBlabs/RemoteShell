export function ChangeRawCommandPlaceholdersToRequestKeys(rawCommand, requestKeys, options)
{
    const keys = Object.keys(requestKeys);

    keys.forEach(key => 
    {
        const regex = new RegExp("\{" + key + "\}");

        if (options === "Base64Params")
        {
            const reqKey = requestKeys[key];
console.log(reqKey);
            let buff = Buffer.from(reqKey, 'base64');
            let k = buff.toString();
            console.log('kkkkkkkkk', k);

            rawCommand = rawCommand.replace(regex, k);
        }
        else
        {
            rawCommand = rawCommand.replace(regex, requestKeys[key]);
        }
    });

    return rawCommand;
}