import axios from "axios";

export let calls = 0;

export async function Post<T>(url: string, data?: string, headers?: object): Promise<{ status: number; data: T; }>
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
        console.log(`#${calls} EXCEPTION @ "${url}": ${ex.message}`);

        throw new Error(ex.message);
    }
}

export async function Get<T>(url: string, headers?: object): Promise<{ status: number; data: T; }>
{
    calls++;

    try
    {
        // console.log('POST', url, data, headers);
        const response = await axios.get(url, { headers, timeout: 5 * 1000 });

        // console.log(response.status, response.data);
        return ({ status: response.status, data: response.data as T });
    }
    catch (ex)
    {
        console.log(`#${calls} EXCEPTION @ "${url}": ${ex.message}`);

        throw new Error(ex.message);
    }
}
