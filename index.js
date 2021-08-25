const fs = require('fs')
/** Name of the bridge ABI file */
const bridgeABI = require('./bridge.json')
/** Filename for the generated Solidity bridge interface file */
const BRIDGE_SOL = './contracts/Bridge.sol'

const functions = bridgeABI.filter(
  (element) => element.type === 'function',
)
const stream = fs.createWriteStream(BRIDGE_SOL)
stream.write(`// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface Bridge {
`)
functions.forEach((f) => {
  // function parameters
  const inputs = f.inputs
    .map((i) => {
      // add 'calldata' to the following types
      const type = [
        'bytes',
        'bytes[]',
        'bytes32[]',
        'string',
      ].includes(i.type)
        ? `${i.type} calldata`
        : i.type
      return `${type} _${i.name}`
    })
    .join(', ')
  // function return values
  const outputs = f.outputs
    .map((o) => {
      // add 'memory' to the following types
      const type = ['bytes', 'string'].includes(o.type)
        ? `${o.type} memory`
        : o.type
      return `${type}${o.name ? ` ${o.name}` : ''}`
    })
    .join(', ')
  // record a single function signature
  stream.write(
    `    ${f.type} ${f.name}(${inputs}) external${
      f.constant ? ' view' : ''
    }${outputs ? ` returns (${outputs})` : ''};\n`,
  )
})
stream.write('}\n')
stream.end()
console.log(
  `The bridge was generated. Find it in the file ${BRIDGE_SOL}`,
)
