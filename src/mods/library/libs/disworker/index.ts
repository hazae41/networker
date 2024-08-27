export class DisWorker extends Worker {

  [Symbol.dispose]() {
    this.terminate()
  }

}