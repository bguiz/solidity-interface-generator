import fs from 'fs';

const DEFAULT_ABI_FILE = 'abi.json';
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
      // if a file was not specified in stdin either, try to read the default file
      setTimeout(() => {
        stdin.pause();
        try {
          resolve(JSON.parse(fs.readFileSync(DEFAULT_ABI_FILE)));
        } catch (error) {
          reject(error);
        }
      }, 100);
    }
  });
}
export default readABI;
