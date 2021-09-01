#! /usr/bin/env node

import fs from 'fs-extra';
import { resolve, dirname } from 'path';
import colors from 'colors';
import { fileURLToPath } from 'url';
import readABI from './src/readABI.js';
import writeInterface from './src/writeInterface.js';
import parseCLI from './src/parseCLI.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
