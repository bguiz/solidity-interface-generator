#! /usr/bin/env node

const fs = require('fs-extra');
const { resolve } = require('path');
const colors = require('colors');
const readABI = require('./src/readABI.js');
const writeInterface = require('./src/writeInterface.js');
const parseCLI = require('./src/parseCLI.js');

async function main() {
  try {
    // read user specified options
    const { outputFilename, pragma, abiFilename, color } = parseCLI();
    // Accept ABI JSON file from stdin stream or from provided file
    const abi = await readABI(abiFilename);
    // only select function signatures from the ABI
    const functions = abi.filter((element) => element.type === 'function');
    if (outputFilename) {
      const outputFile = resolve(__dirname, 'contracts', outputFilename);
      colors.disable();
      writeInterface(functions, pragma, fs.createWriteStream(outputFile));
      process.stdout.write(
        `The bridge was generated. Find it in the file ${outputFile}\n`,
      );
    } else {
      // paint the text with colors if output to the console
      colors[color ? 'enable' : 'disable']();
      writeInterface(functions, pragma, process.stdout);
    }
  } catch (error) {
    process.stdout.write(`Could not generate an interface. ${error.message}\n`);
  }
}
main();
