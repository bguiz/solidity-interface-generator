#! /usr/bin/env node

import fs from 'fs-extra';
import { resolve, dirname } from 'path';
import { program } from 'commander';
import colors from 'colors';
import { fileURLToPath } from 'url';
import readABI from './src/readABI.js';
import writeInterface from './src/writeInterface.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  try {
    // set CLI params and options
    program
      .version('0.0.1')
      .option(
        '-p, --pragma <pragma>',
        'add Solidity pragma expression',
        'solidity >=0.7.0 <0.9.0',
      )
      .option(
        '-o, --output <filename>',
        'specify a name for an output file. Writes to standart output by default',
      )
      .option(
        '-a, --abi <filename>',
        'specify a name for the ABI JSON file',
        'abi.json',
      );
    program.parse();
    const { output, pragma, abi: abiJson } = program.opts();
    const outputFile = output && resolve(__dirname, 'contracts', output);

    // Accept ABI JSON file from stdin stream or from provided file
    const abi = await readABI(abiJson);

    // paint the text with colors if output to the console
    colors[output ? 'disable' : 'enable']();
    // Write output to stdout if output file is not specified
    const stream = output ? fs.createWriteStream(outputFile) : process.stdout;
    // only select function signatures from the ABI
    const functions = abi.filter((element) => element.type === 'function');
    // output function signatures to the selected stream
    writeInterface(functions, pragma, stream);

    if (output) {
      process.stdout.write(
        `The bridge was generated. Find it in the file ${outputFile}\n`,
      );
    }
  } catch (error) {
    process.stdout.write(`Could not generate an interface. ${error.message}\n`);
  }
}
main();
