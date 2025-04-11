import { assert } from "@hazae41/phobos";
import { NetWorker } from "./worker/index.js";

using worker = new NetWorker()

const versionZeroHex = "0x1"
const addressZeroHex = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
const nonceZeroHex = "0x0"

await using mixin = await worker.createOrThrow({ versionZeroHex, addressZeroHex, nonceZeroHex })

const minimumZeroHex = "0x0000000000000000000000000000000000000000000000000000000000100000"

const { secretZeroHex, proofZeroHex } = await mixin.generateOrThrow(minimumZeroHex)

const proofValueZeroHex = await mixin.verifyProofOrThrow(proofZeroHex)
const secretValueZeroHex = await mixin.verifySecretOrThrow(secretZeroHex)

assert(proofValueZeroHex === secretValueZeroHex)

console.log(`Generated ${BigInt(secretValueZeroHex)} wei`)