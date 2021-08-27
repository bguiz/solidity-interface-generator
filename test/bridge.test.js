const { describe, it } = require('mocha');
const util = require('util');
const assert = require('assert');
const fs = require('fs-extra');
const path = require('path');
const exec = util.promisify(require('child_process').exec);
const solc = require('solc');

const getPath = (file) => path.resolve(__dirname, '..', 'contracts', file);

const DEFAULT_OUTPUT_FILENAME = 'Bridge.sol';
const DEFAULT_INPUT_FILENAME = 'bridge.json';

describe('Bridge generator', () => {
  it('generates a bridge file', async () => {
    try {
      // delete previously created interface
      await fs.remove(getPath(DEFAULT_OUTPUT_FILENAME));
      // execute Terminal command
      const { stdout } = await exec(
        `node src/index.js -o ${DEFAULT_OUTPUT_FILENAME} < ${DEFAULT_INPUT_FILENAME}`,
      );
      // check if the certain string was sent to the stdout
      assert.strictEqual(
        stdout,
        `The bridge was generated. Find it in the file ./contracts/${DEFAULT_OUTPUT_FILENAME}\n`,
      );
    } catch (error) {
      assert(false, error.message);
    }
  });

  it('compiles contracts using generated file', async () => {
    try {
      const contractFileName = 'Federation.sol';
      const contractFile = await fs.readFile(getPath(contractFileName), 'utf8');
      const interfaceFile = await fs.readFile(
        getPath(DEFAULT_OUTPUT_FILENAME),
        'utf8',
      );
      const input = {
        language: 'Solidity',
        sources: {
          [contractFileName]: {
            content: contractFile,
          },
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*'],
            },
          },
        },
      };
      const findImports = (filePath) =>
        filePath === DEFAULT_OUTPUT_FILENAME
          ? { contents: interfaceFile }
          : { error: 'File not found' };
      const compilation = JSON.parse(
        solc.compile(JSON.stringify(input), { import: findImports }),
      );
      if (compilation.errors) {
        throw new Error(compilation.errors[0].message);
      }
      const {
        [DEFAULT_OUTPUT_FILENAME]: bridge,
        [contractFileName]: federation,
      } = compilation.contracts;
      assert(bridge && federation);
    } catch (error) {
      assert(false, error.message);
    }
  });
});
