import "@hazae41/symbol-dispose-polyfill";

import { NetworkMixin, NetworkWasm } from "@hazae41/network.wasm";
import { NetworkParams } from "mods/common/index.js";

async function generateOrThrow(params: NetworkParams) {
  const { chainIdString, contractZeroHex, receiverZeroHex, nonceZeroHex, minimumZeroHex } = params

  await NetworkWasm.initBundled()

  const chainIdBase16 = Number(chainIdString).toString(16).padStart(64, "0")
  using chainIdMemory = NetworkWasm.base16_decode_mixed(chainIdBase16)

  const contractBase16 = contractZeroHex.slice(2).padStart(64, "0")
  using contractMemory = NetworkWasm.base16_decode_mixed(contractBase16)

  const receiverBase16 = receiverZeroHex.slice(2).padStart(64, "0")
  using receiverMemory = NetworkWasm.base16_decode_mixed(receiverBase16)

  const nonceBase16 = nonceZeroHex.slice(2).padStart(64, "0")
  using nonceMemory = NetworkWasm.base16_decode_mixed(nonceBase16)

  using mixinStruct = new NetworkMixin(chainIdMemory, contractMemory, receiverMemory, nonceMemory)

  const minimumBase16 = minimumZeroHex.slice(2).padStart(64, "0")
  using minimumMemory = NetworkWasm.base16_decode_mixed(minimumBase16)

  using generatedStruct = mixinStruct.generate(minimumMemory)

  using secretMemory = generatedStruct.to_secret()
  const secretBase16 = NetworkWasm.base16_encode_lower(secretMemory)
  const secretZeroHex = `0x${secretBase16}`

  return secretZeroHex
}

self.addEventListener("message", async (e: MessageEvent<NetworkParams>) => self.postMessage(await generateOrThrow(e.data)))