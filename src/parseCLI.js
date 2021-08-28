import { program } from 'commander';

function parseCLI() {
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
  const { output: outputFilename, pragma, abi: abiFilename } = program.opts();
  return { outputFilename, pragma, abiFilename };
}
export default parseCLI;
