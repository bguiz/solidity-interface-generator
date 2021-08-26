function readJsonFromStdin() {
  const { stdin } = process
  const inputChunks = []

  stdin.resume()
  stdin.setEncoding('utf8')

  stdin.on('data', (chunk) => {
    inputChunks.push(chunk)
  })

  return new Promise((resolve, reject) => {
    stdin.on('end', () => {
      const inputJSON = inputChunks.join()
      resolve(JSON.parse(inputJSON))
    })
    stdin.on('error', () => {
      reject(Error('error during read'))
    })
    stdin.on('timeout', () => {
      reject(Error('timout during read'))
    })
  })
}
module.exports = readJsonFromStdin
