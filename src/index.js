#! /usr/bin/env node

const fs = require('fs-extra')
const { program } = require('commander')
const colors = require('colors')
// const readJsonFromStdin = require('./readJsonFromStdin')
const writeInterface = require('./writeInterface')

const DEFAULT_INPUT_FILENAME = './bridge.json'

async function main() {
  try {
    // set CLI params and options
    program
      .version('0.0.1')
      .option(
        '-p, --pragma <pragma>',
        'Add Solidity pragma expression',
        'solidity >=0.7.0 <0.9.0',
      )
      .option(
        '-o, --output <filename>',
        'Specify a name for an output file. Writes to standart output by default',
      )
    program.parse()

    // Accept ABI JSON file from stdin stream
    // let inputFile = await readJsonFromStdin()
    let inputFile = await fs.readJSON('/dev/stdin')
    if (!inputFile)
      inputFile = await fs.readJSON(DEFAULT_INPUT_FILENAME)

    // file name of the resulting Solidity file (if set by user)
    const outputFile = program.opts().output
    // paint the text with colors if output to the console
    if (outputFile) {
      colors.disable()
    } else {
      colors.enable()
    }
    // Write output to stdout if output file is not specified
    const stream = outputFile
      ? fs.createWriteStream(`./contracts/${outputFile}`)
      : process.stdout
    // only select function signatures from the ABI
    const functions = inputFile.filter(
      (element) => element.type === 'function',
    )
    // output function signatures to the selected stream
    writeInterface(functions, program.opts().pragma, stream)

    if (outputFile) {
      process.stdout.write(
        `The bridge was generated. Find it in the file ./contracts/${outputFile}\n`,
      )
    }
  } catch (error) {
    process.stdout.write('Could not generate an interface.\n')
  }
}
main()
