import fs from 'fs';
/**
 * First tries to read ABI from stdin, then from --abi (-a)
 * command line parameter.
 * @param {string} filename user specified or default ABI filename
 * @returns {Promise<[]>} ABI interface
 */
function readABI(filename) {
  const { stdin } = process;
  stdin.setEncoding('utf8');
  return new Promise((resolve, reject) => {
    // trying to read a file from stdin (command line)
    stdin.on('data', (file) => {
      try {
        resolve(JSON.parse(file));
      } catch (error) {
        reject(error);
      }
    });
    stdin.on('error', () => {
      reject(Error('Error reading ABI file'));
    });
    // trying to read a file from --abi command line parameter
    // or from a default filename
    setTimeout(() => {
      try {
        stdin.pause();
        resolve(JSON.parse(fs.readFileSync(filename)));
      } catch (error) {
        reject(error);
      }
    }, 50);
  });
}
export default readABI;
