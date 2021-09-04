#! /usr/bin/env node

import fs from 'fs-extra';
import { resolve, dirname } from 'path';
import colors from 'colors';
import { fileURLToPath } from 'url';
import readABI from './src/readABI.js';
import getInterface from './src/getInterface.js';
import parseCLI from './src/parseCLI.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  try {
    // read user specified options
    const { outputFilename, pragma, abiFilename, colorEnabled } = parseCLI();
    // Accept ABI JSON file from stdin stream or from provided file
    const abi = await readABI(abiFilename);
    if (outputFilename) {
      const outputFile = resolve(__dirname, 'contracts', outputFilename);
      fs.createWriteStream(outputFile).write(getInterface(abi, pragma));
      process.stdout.write(
        `The bridge was generated. Find it in the file ${outputFile}\n`,
      );
    } else {
      process.stdout.write(getInterface(abi, pragma, colorEnabled && colors));
    }
  } catch (error) {
    process.stdout.write(`Could not generate an interface. ${error.message}\n`);
  }
}
main();
