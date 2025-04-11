import "@hazae41/symbol-dispose-polyfill";

import { RpcError, RpcMethodNotFoundError, RpcRequestInit, RpcRequestPreinit, RpcResponse } from "@hazae41/jsonrpc";
import { NetworkMixin, NetworkWasm } from "@hazae41/network.wasm";
import { Err, Ok } from "@hazae41/result";
import { NetWorkerCreateParams, NetWorkerGenerateResult } from "mods/common/index.js";

await NetworkWasm.initBundled()

const mixins = new Map<string, NetworkMixin>()

function createOrThrow(request: RpcRequestPreinit<unknown>) {
  const [params] = (request as RpcRequestPreinit<[NetWorkerCreateParams]>).params

  const { versionZeroHex, addressZeroHex, nonceZeroHex } = params

  const uuid = crypto.randomUUID()

  const versionBase16 = versionZeroHex.slice(2).padStart(64, "0")
  using versionMemory = NetworkWasm.base16_decode_mixed(versionBase16)

  const addressBase16 = addressZeroHex.slice(2).padStart(64, "0")
  using addressMemory = NetworkWasm.base16_decode_mixed(addressBase16)

  const nonceBase16 = nonceZeroHex.slice(2).padStart(64, "0")
  using nonceMemory = NetworkWasm.base16_decode_mixed(nonceBase16)

  const mixinStruct = new NetworkMixin(versionMemory, addressMemory, nonceMemory)

  mixins.set(uuid, mixinStruct)

  return uuid
}

function destroyOrThrow(request: RpcRequestPreinit<unknown>) {
  const [uuid] = (request as RpcRequestPreinit<[string]>).params

  using _ = mixins.get(uuid)

  mixins.delete(uuid)
}

function generateOrThrow(request: RpcRequestPreinit<unknown>): NetWorkerGenerateResult {
  const [uuid, minimumZeroHex] = (request as RpcRequestPreinit<[string, string]>).params

  const mixinStruct = mixins.get(uuid)

  if (mixinStruct == null)
    throw new Error("Not found")

  const minimumBase16 = minimumZeroHex.slice(2).padStart(64, "0")
  using minimumMemory = NetworkWasm.base16_decode_mixed(minimumBase16)

  using generatedStruct = mixinStruct.generate(minimumMemory)

  using proofMemory = generatedStruct.to_proof()
  const proofBase16 = NetworkWasm.base16_encode_lower(proofMemory)
  const proofZeroHex = `0x${proofBase16}`

  using secretMemory = generatedStruct.to_secret()
  const secretBase16 = NetworkWasm.base16_encode_lower(secretMemory)
  const secretZeroHex = `0x${secretBase16}`

  using valueMemory = generatedStruct.to_value()
  const valueBase16 = NetworkWasm.base16_encode_lower(valueMemory)
  const valueZeroHex = `0x${valueBase16}`

  return { secretZeroHex, proofZeroHex, valueZeroHex }
}

function verifyProofOrThrow(request: RpcRequestPreinit<unknown>) {
  const [uuid, proofZeroHex] = (request as RpcRequestPreinit<[string, string]>).params

  const mixinStruct = mixins.get(uuid)

  if (mixinStruct == null)
    throw new Error("Not found")

  const proofBase16 = proofZeroHex.slice(2).padStart(64, "0")
  using proofMemory = NetworkWasm.base16_decode_mixed(proofBase16)

  using valueMemory = mixinStruct.verify_proof(proofMemory)
  const valueBase16 = NetworkWasm.base16_encode_lower(valueMemory)
  const valueZeroHex = `0x${valueBase16}`

  return valueZeroHex
}

function verifySecretOrThrow(request: RpcRequestPreinit<unknown>) {
  const [uuid, secretZeroHex] = (request as RpcRequestPreinit<[string, string]>).params

  const mixinStruct = mixins.get(uuid)

  if (mixinStruct == null)
    throw new Error("Not found")

  const secretBase16 = secretZeroHex.slice(2).padStart(64, "0")
  using secretMemory = NetworkWasm.base16_decode_mixed(secretBase16)

  using valueMemory = mixinStruct.verify_secret(secretMemory)
  const valueBase16 = NetworkWasm.base16_encode_lower(valueMemory)
  const valueZeroHex = `0x${valueBase16}`

  return valueZeroHex
}

function routeAndWrap(request: RpcRequestPreinit<unknown>) {
  try {
    if (request.method === "net_create")
      return new Ok(createOrThrow(request))
    if (request.method === "net_destroy")
      return new Ok(destroyOrThrow(request))
    if (request.method === "net_generate")
      return new Ok(generateOrThrow(request))
    if (request.method === "net_verify_secret")
      return new Ok(verifySecretOrThrow(request))
    if (request.method === "net_verify_proof")
      return new Ok(verifyProofOrThrow(request))

    return new Err(new RpcMethodNotFoundError())
  } catch (e: unknown) {
    return new Err(RpcError.rewrap(e))
  }
}

self.addEventListener("message", async (e: MessageEvent<RpcRequestInit<unknown>>) => {
  const result = routeAndWrap(e.data)
  const response = RpcResponse.rewrap(e.data.id, result)
  self.postMessage(response)
})