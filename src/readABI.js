const fs = require('fs');

/**
 * First tries to read ABI from --abi (-a) command line parameter,
 * then from stdin, and lastly from the default filename
 * @param {string} filename user specified or default ABI filename
 * @returns {Promise<[]>} ABI interface
 */
function readABI(filename) {
  return new Promise((resolve, reject) => {
    // trying to read a file from --abi command line parameter
    if (filename) {
      try {
        resolve(JSON.parse(fs.readFileSync(filename)));
      } catch (error) {
        reject(error);
      }

      // if --abi param was not specified, try to read from stdin
    } else {
      const { stdin } = process;
      stdin.setEncoding('utf8');
      const chunks = [];
      stdin.on('data', (chunk) => {
        chunks.push(chunk);
      });
      stdin.on('end', () => {
        try {
          resolve(JSON.parse(chunks.join('')));
        } catch (error) {
          reject(error);
        }
      });
      stdin.on('error', () => {
        reject(Error('Error reading ABI file'));
      });
    }
  });
}
module.exports = readABI;
