/**
 * Generates Solidity interface from ABI and writes it to a specified stream
 * @param {[]} functions ABI descriptions of function signatures
 * @param {string} pragma Solidity pragma statement
 * @param {WritableStream} stream stream to write to
 */
function writeInterface(functions, pragma, stream = process.stdout) {
  stream.write(`${'// SPDX-License-Identifier: GPL-3.0'.gray}
${'pragma'.brightYellow} ${pragma};
  
${'interface'.blue} Bridge {
`);
  functions.forEach((f) => {
    // function parameters
    const inputs = f.inputs
      .map((i) => {
        // add 'calldata' to the following types
        const type = ['bytes', 'bytes[]', 'bytes32[]', 'string'].includes(
          i.type,
        )
          ? `${i.type.blue} ${'calldata'.yellow}`
          : i.type.blue;
        return `${type} _${i.name}`;
      })
      .join(', ');
    // function return values
    const outputs = f.outputs
      .map((o) => {
        // add 'memory' to the following types
        const type = ['bytes', 'string'].includes(o.type)
          ? `${o.type.blue} ${'memory'.yellow}`
          : o.type.blue;
        return `${type}${o.name ? ` ${o.name}` : ''}`;
      })
      .join(', ');
    // record a single function signature
    stream.write(
      `    ${f.type.blue} ${f.name.green}(${inputs}) ${'external'.yellow}${
        f.constant ? ' view'.yellow : ''
      }${outputs ? ` ${'returns'.brightYellow} (${outputs})` : ''};\n`,
    );
  });
  stream.write('}\n');
  stream.end();
}
export default writeInterface;
