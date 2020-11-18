const input = document.querySelector("#InputTextbox");
const runButton = document.querySelector("#RunButton");
const output = document.querySelector("#OutputTextarea");
const httpResponseCode = document.querySelector("#HttpResponseCode");

let history = ['pwd', 'ls'];
let historyLength = 1;

input.value = history[historyLength];

function LoadHistory(c)
{
    historyLength += c;
    if (historyLength <= 0) historyLength = 0;
    if (historyLength >= history.length) historyLength = history.length - 1;
    input.value = history[historyLength];
}

const RunRoutine = async () => 
{
    output.textContent = "";
    httpResponseCode.textContent = "Awaiting response...";
    const inputValue = input.value;
    historyLength = history.length - 1;
    if (inputValue !== history[historyLength])
        history.push(inputValue);
    const trackDirAsBase64 = btoa(inputValue);
    let response;
    try
    {
        response = await fetch('/shell64/' + trackDirAsBase64);
        const data = await response.text();
        output.textContent = data;
    }
    catch (error)
    {
        alert(error);
    }
    finally
    {
        httpResponseCode.textContent = "Http response code: " + response.status;
    }
}

input.onkeydown = (e) => 
{
    if (e.key === 'ArrowDown') LoadHistory(1);
    if (e.key === 'ArrowUp') LoadHistory(-1);
}

input.onkeypress = (e) =>
{
    if (e.key === 'Enter') RunRoutine();
}

runButton.addEventListener('click', RunRoutine);

input.focus();