import { program } from 'commander';

function setCLI() {
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
  return { output, pragma, abiJson };
}
export default setCLI;
