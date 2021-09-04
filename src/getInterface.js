/**
 * Generates and returnes Solidity interface from ABI
 * @param {*} abi ABI object
 * @param {string} pragma Solidity pragma statement
 * @param {*} colorLib coloring library ("colors") that may optionally be passed to make a syntax highlighting in the ouput text
 * @returns {string} Solidity interface
 */
function getInterface(abi, pragma = 'solidity >=0.7.0 <0.9.0', colorLib) {
  // if coloring library is not passed just print text
  const colors = new Proxy(
    typeof colorLib === 'object' && colorLib ? colorLib : {},
    {
      get: (target, propKey) => (args) =>
        propKey in target ? target[propKey](args) : args,
    },
  );

  // only select function signatures from the ABI
  const functions = abi.filter((element) => element.type === 'function');
  let returnString = `${colors.gray('// SPDX-License-Identifier: GPL-3.0')}
${colors.brightYellow('pragma')} ${pragma};
  
${colors.blue('interface')} Bridge {
`;
  functions.forEach((f) => {
    // function parameters
    const inputs = f.inputs
      .map((i) => {
        // add 'calldata' to the following types
        const type = ['bytes', 'bytes[]', 'bytes32[]', 'string'].includes(
          i.type,
        )
          ? `${colors.blue(i.type)} ${colors.yellow('calldata')}`
          : colors.blue(i.type);
        return `${type} _${i.name}`;
      })
      .join(', ');
    // function return values
    const outputs = f.outputs
      .map((o) => {
        // add 'memory' to the following types
        const type = ['bytes', 'string'].includes(o.type)
          ? `${colors.blue(o.type)} ${colors.yellow('memory')}`
          : colors.blue(o.type);
        return `${type}${o.name ? ` ${o.name}` : ''}`;
      })
      .join(', ');
    // record a single function signature
    returnString += `    ${colors.blue(f.type)} ${colors.green(
      f.name,
    )}(${inputs}) ${colors.yellow('external')}${
      f.constant ? colors.yellow(' view') : ''
    }${outputs ? ` ${colors.brightYellow('returns')} (${outputs})` : ''};\n`;
  });
  returnString += '}\n';
  return returnString;
}
export default getInterface;
