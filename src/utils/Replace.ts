export function Replace(str, params)
{
    const keys = Object.keys(params);

    keys.forEach(k => 
    {
        const regex = new RegExp("\{" + k + "\}");
        
        str = str.replace(regex, params[k]);
    });

    return str;
}