# solidity-interface-generator

  ## Usage
  Options parameter | Description
  ------------------|------------------------------------------------------------
  -p, --pragma <pragma> | add Solidity pragma expression (default: "solidity >=0.7.0 <0.9.0")
  -o, --output <filename> | specify a name for an output file. When unspecified, reads from the standard input
  -a, --abi <filename> | specify a name for the ABI JSON file (default: "abi.json")
  --no-color | disable colored syntax hinglighting in the Terminal window
  -V, --version | output the version number
  -h, --help | display help for command

  ### Example
  The following Terminal commands give the same result: the script `index.js` receives a file `abi.json`
  and generates Solidity interface to the file `contracts/Bridge.sol`
  ```bash
    % node index.js -o Bridge.sol < abi.json
    % node index.js --output Bridge.sol --abi abi.json
    % cat abi.json | node index.js -o Bridge.sol
  ```
  If an output file was not specified, generates an interface and outputs it to the Terminal window
  ```bash
    % node index.js < abi.json
  ```
  If neither output Solidity interface file, nor input JSON ABI file were specified, takes data from
  `abi.json` and writes an interface to the Terminal window. Solidity pragma expression could be added as follows
  ```bash
    % node index.js --pragma "solidity ^0.8.1"
  ```

## Instructions

- Implement items from the roadmap in sequential order
- Each item should be a separate PR

## Roadmap

- [x] Init repo
  - add roadmap & instructions to README
- [x] Add `package.json`
  - [x] update README to include new author
- [x] Add main feature already implemented in script
- [x] Add dependency on linting tool
  - [x] add npm run script
- [x] Add dependency on testing framework
  - [x] add npm run script
  - [x] add test cases including files
- [x] Add dependency for CLI tool
  - [x] Accept value for `pragma` as a CLI parameter
  - [x] Accept value for `output` as a CLI parameter
  - [x] Accept ABI JSON file from `stdin` stream
  - [x] Write output to `stdout` if `output` file is not specified

- [x] Add code coverage tool for mocha tests

## Author

[Brendan Graetz](http://bguiz.com/)

[Aleks Shenshin](https://github.com/shenshin/)

## Licence

GPL-3.0
