export class Disworker extends Worker {

  [Symbol.dispose]() {
    this.terminate()
  }

}