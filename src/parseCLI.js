import { program } from 'commander';
/**
 * Reads options from the Terminal command line
 * @returns object with the user specified options
 */
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
      'specify a name for the ABI JSON file. When unspecified, reads from the standard input',
    )
    .option(
      '--no-color',
      'disable colored syntax hinglighting in the Terminal window',
    );
  program.parse();
  const {
    output: outputFilename,
    pragma,
    abi: abiFilename,
    color: colorEnabled,
  } = program.opts();
  return { outputFilename, pragma, abiFilename, colorEnabled };
}
export default parseCLI;
