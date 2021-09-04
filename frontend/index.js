import getInterface from '../src/getInterface.js';

const abiInput = document.getElementById('abi-input');
const solidityOutput = document.getElementById('solidity-output');
const convertButton = document.getElementById('convert-button');

const setError = (message) => {
  solidityOutput.classList[message ? 'add' : 'remove']('error');
  solidityOutput.innerHTML = message ?? '';
};

convertButton.addEventListener('click', () => {
  try {
    setError();
    solidityOutput.innerHTML = getInterface(JSON.parse(abiInput.value));
  } catch (error) {
    setError(error.message);
  }
});

async function main() {
  try {
    setError();
    const response = await fetch('../abi.json');
    if (!response.ok) throw new Error(response.statusText);
    abiInput.value = await response.text();
  } catch (error) {
    setError(error.message);
  }
}
main();
