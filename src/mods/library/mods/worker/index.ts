import { Deferred, Stack } from "@hazae41/box";
import { Future } from "@hazae41/future";
import { NetworkParams } from "mods/common/index.js";
import { Disworker } from "mods/library/libs/disworker/index.js";
import { data } from "../data/index.js";

export class Networker extends Disworker {

  constructor() {
    super(data, { type: "module" });
  }

  async generateOrThrow(params: NetworkParams) {
    using stack = new Stack()
    const future = new Future<string>()

    const onMessage = (e: MessageEvent<string>) => future.resolve(e.data)

    this.addEventListener("message", onMessage, { passive: true })
    stack.push(new Deferred(() => this.removeEventListener("message", onMessage)))

    const onError = () => future.reject(new Error("Errored"))

    this.addEventListener("error", onError, { passive: true })
    stack.push(new Deferred(() => this.removeEventListener("error", onError)))

    const onMessageError = (cause: unknown) => future.reject(new Error("Errored", { cause }))

    this.addEventListener("messageerror", onMessageError, { passive: true })
    stack.push(new Deferred(() => this.removeEventListener("messageerror", onMessageError)))

    this.postMessage(params)

    return await future.promise
  }

}