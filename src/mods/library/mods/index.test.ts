import { NetWorker } from "./worker/index.js";

using worker = new NetWorker()

console.log("ddd")

const mixin = await worker.createOrThrow({
  chainIdString: "1",
  contractZeroHex: "0xF1eC047cbd662607BBDE9Badd572cf0A23E1130B",
  receiverZeroHex: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
  nonceZeroHex: "0x9537efb9ece40a1d72241f1fd5dcbb32e8eae43df579d02bf861b339a9126c64",
})

console.log("lol")

const {
  secretZeroHex,
  proofZeroHex
} = await mixin.generateOrThrow("0x0000000000000000000000000000000000000000000000000000000000000001")

const proofValueZeroHex = await mixin.verifyProofOrThrow(proofZeroHex)
const secretValueZeroHex = await mixin.verifySecretOrThrow(secretZeroHex)

console.log(proofValueZeroHex)
console.log(secretValueZeroHex)