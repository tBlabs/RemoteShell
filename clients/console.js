const input = document.querySelector("#InputTextbox");
const runButton = document.querySelector("#RunButton");
const output = document.querySelector("#OutputTextarea");

let history = ['pwd', 'ls'];
let h = 1;

input.value = history[h];

function LoadHistory(c)
{
    h += c;
    if (h <= 0) h = 0;
    if (h >= history.length) h = history.length - 1;
    input.value = history[h];
}

const RunRoutine = async () => 
{
    output.textContent = "";
    const inputValue = input.value;
    history.push(inputValue);
    h = history.length - 1;
    const trackDirAsBase64 = btoa(inputValue);
    const response = await fetch('/shell64/' + trackDirAsBase64);
    const data = await response.text();
    output.textContent = data;
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