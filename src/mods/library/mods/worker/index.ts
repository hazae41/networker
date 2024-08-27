import { Deferred, Stack } from "@hazae41/box";
import { Future } from "@hazae41/future";
import { RpcCounter, RpcRequestPreinit, RpcResponse, RpcResponseInit } from "@hazae41/jsonrpc";
import { NetworkCreateParams, NetworkGenerateResult } from "mods/common/index.js";
import { DisWorker } from "mods/library/libs/disworker/index.js";
import { data } from "../data/index.js";

export class NetWorker extends DisWorker {

  readonly counter = new RpcCounter()

  constructor() {
    super(data, { type: "module" });
  }

  async requestOrThrow<T>(prerequest: RpcRequestPreinit<unknown>) {
    using stack = new Stack()

    const request = this.counter.prepare(prerequest)
    const future = new Future<RpcResponse<T>>()

    const onMessage = (e: MessageEvent<RpcResponseInit<T>>) => {
      if (e.data.id !== request.id)
        return
      future.resolve(RpcResponse.from(e.data))
    }

    this.addEventListener("message", onMessage, { passive: true })
    stack.push(new Deferred(() => this.removeEventListener("message", onMessage)))

    const onError = () => future.reject(new Error("Errored"))

    this.addEventListener("error", onError, { passive: true })
    stack.push(new Deferred(() => this.removeEventListener("error", onError)))

    const onMessageError = (cause: unknown) => future.reject(new Error("Errored", { cause }))

    this.addEventListener("messageerror", onMessageError, { passive: true })
    stack.push(new Deferred(() => this.removeEventListener("messageerror", onMessageError)))

    this.postMessage(request)

    return await future.promise
  }

  async createOrThrow(params: NetworkCreateParams) {
    const uuid = await this.requestOrThrow<string>({
      method: "net_create",
      params: [params]
    }).then(r => r.getOrThrow())

    return new NetMixin(this, uuid)
  }

}

export class NetMixin {

  constructor(
    readonly worker: NetWorker,
    readonly uuid: string
  ) { }

  async [Symbol.asyncDispose]() {
    await this.worker.requestOrThrow<void>({
      method: "net_destroy",
      params: [this.uuid]
    }).then(r => r.getOrThrow())
  }

  async generateOrThrow(minimumZeroHex: string) {
    return await this.worker.requestOrThrow<NetworkGenerateResult>({
      method: "net_generate",
      params: [this.uuid, minimumZeroHex]
    }).then(r => r.getOrThrow())
  }

  async verifyProofOrThrow(proofZeroHex: string) {
    return await this.worker.requestOrThrow<string>({
      method: "net_verify_proof",
      params: [this.uuid, proofZeroHex]
    }).then(r => r.getOrThrow())
  }

  async verifySecretOrThrow(secretZeroHex: string) {
    return await this.worker.requestOrThrow<string>({
      method: "net_verify_secret",
      params: [this.uuid, secretZeroHex]
    }).then(r => r.getOrThrow())
  }

}