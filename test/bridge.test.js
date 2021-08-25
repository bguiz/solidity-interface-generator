const { describe, it } = require('mocha')
const util = require('util')
const assert = require('assert')
const fs = require('fs-extra')
const path = require('path')
const exec = util.promisify(require('child_process').exec)

describe('Bridge generator', () => {
  it('generates a bridge file', async () => {
    try {
      // delete previously created interface
      await fs.remove(
        path.resolve(__dirname, '..', 'contracts', 'Bridge.sol'),
      )
      // execute Terminal command
      const { stdout } = await exec('node index.js')
      // compare standart output with a certain string
      assert.strictEqual(
        stdout,
        'The bridge was generated. Find it in the file ./contracts/Bridge.sol\n',
      )
    } catch (error) {
      assert(false, error.message)
    }
  })
})
