const { describe, it } = require('mocha');
const util = require('util');
const assert = require('assert');
const fs = require('fs-extra');
const path = require('path');
const exec = util.promisify(require('child_process').exec);
const solc = require('solc');

const getPath = (file) => path.resolve(__dirname, '..', 'contracts', file);

describe('Bridge generator', () => {
  it('generates a bridge file', async () => {
    try {
      // delete previously created interface
      await fs.remove(getPath('Bridge.sol'));
      // execute Terminal command
      const { stdout } = await exec('node index.js');
      // compare standart output with a certain string
      assert.strictEqual(
        stdout,
        'The bridge was generated. Find it in the file ./contracts/Bridge.sol\n',
      );
    } catch (error) {
      assert(false, error.message);
    }
  });

  it('compiles contracts using generated file', async () => {
    try {
      const contractFile = await fs.readFile(getPath('Federation.sol'), 'utf8');
      const bridgeFile = await fs.readFile(getPath('Bridge.sol'), 'utf8');
      const input = {
        language: 'Solidity',
        sources: {
          'Federation.sol': {
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
        filePath === 'Bridge.sol'
          ? { contents: bridgeFile }
          : { error: 'File not found' };
      const compilation = JSON.parse(
        solc.compile(JSON.stringify(input), { import: findImports }),
      );
      if (compilation.errors) {
        throw new Error(compilation.errors[0].message);
      }
      const { 'Bridge.sol': bridge, 'Federation.sol': federation } =
        compilation.contracts;
      assert(bridge && federation);
    } catch (error) {
      assert(false, error.message);
    }
  });
});
