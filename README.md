Installation steps:
After the repo is cloned, do an 'npm install' to install node modules

How to start the server?:
node server.js

How to run unit tests?:
npm run test

Sample curl request for tokenization:

curl -X POST http://localhost:3000/tokenize \
  -H "Content-Type: application/json" \
  -d '["1234567890", "0987654321"]'


Sample curl request for detokenization:

curl -X POST http://localhost:3000/detokenize \
  -H "Content-Type: application/json" \
  -d '["array-of-tokens"]'
