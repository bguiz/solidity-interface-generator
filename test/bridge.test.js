import { describe, it } from 'mocha';
import { promisify } from 'util';
import assert, { strictEqual } from 'assert';
import fs from 'fs-extra';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec as execCallback } from 'child_process';
import solc from 'solc';

const exec = promisify(execCallback);

const getPath = (file) =>
  resolve(dirname(fileURLToPath(import.meta.url)), '..', 'contracts', file);

const DEFAULT_OUTPUT_FILENAME = 'Bridge.sol';
const DEFAULT_INPUT_FILENAME = 'abi.json';

describe('Bridge generator', () => {
  it('generates a bridge file', async () => {
    try {
      // delete previously created interface
      await fs.remove(getPath(DEFAULT_OUTPUT_FILENAME));
      // execute Terminal command
      const { stdout } = await exec(
        `node index.js -o ${DEFAULT_OUTPUT_FILENAME} < ${DEFAULT_INPUT_FILENAME}`,
      );
      // check if the certain string was sent to the stdout
      strictEqual(
        stdout,
        `The bridge was generated. Find it in the file ${getPath(
          DEFAULT_OUTPUT_FILENAME,
        )}\n`,
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
