const input = document.querySelector("#InputTextbox");
const runButton = document.querySelector("#RunButton");
const output = document.querySelector("#OutputTextarea");

const runRoutine = async () => 
{
    output.textContent = "";
    const inputValue = input.value;
    const trackDirAsBase64 = btoa(inputValue);
    const response = await fetch('/shell64/' + trackDirAsBase64);
    const data = await response.text();
    output.textContent = data;
}

input.addEventListener('keypress', (e) =>
{
    if (e.key === 'Enter') runRoutine();
});

runButton.addEventListener('click', runRoutine);