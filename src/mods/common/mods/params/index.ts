export interface NetWorkerCreateParams {
  readonly contractZeroHex: string
  readonly receiverZeroHex: string
  readonly nonceZeroHex: string
}

export interface NetWorkerGenerateResult {
  readonly secretZeroHex: string
  readonly proofZeroHex: string
  readonly valueZeroHex: string
}