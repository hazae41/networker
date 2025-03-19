export abstract class DisWorker {

  readonly abstract worker: Worker

  [Symbol.dispose]() {
    this.worker.terminate()
  }

}