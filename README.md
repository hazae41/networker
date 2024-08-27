# NetWorker

Generate Network secrets in a worker

```bash
npm i @hazae41/networker
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/networker)

## Features

### Current features

- 100% TypeScript and ESM
- No external dependencies
- Pre-bundled
- WebAssembly

## Usage

```tsx
import { NetWorker, NetWorkerCreateParams } from "./worker/index.js";

using worker = new NetWorker()

const chainIdString = "1"
const contractZeroHex = "0xF1eC047cbd662607BBDE9Badd572cf0A23E1130B"
const receiverZeroHex = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
const nonceZeroHex = "0x9537efb9ece40a1d72241f1fd5dcbb32e8eae43df579d02bf861b339a9126c64"

await using mixin = await worker.createOrThrow({ chainIdString, contractZeroHex, receiverZeroHex, nonceZeroHex })

const minimumZeroHex = "0x0000000000000000000000000000000000000000000000000000000000000001"

const { secretZeroHex, proofZeroHex } = await mixin.generateOrThrow(minimumZeroHex)

const proofValueZeroHex = await mixin.verifyProofOrThrow(proofZeroHex)
const secretValueZeroHex = await mixin.verifySecretOrThrow(secretZeroHex)

console.log(proofValueZeroHex)
console.log(secretValueZeroHex)
```
