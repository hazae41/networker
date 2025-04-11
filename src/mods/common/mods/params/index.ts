export interface NetWorkerCreateParams {
  readonly versionZeroHex: string
  readonly addressZeroHex: string
  readonly nonceZeroHex: string
}

export interface NetWorkerGenerateResult {
  readonly secretZeroHex: string
  readonly proofZeroHex: string
  readonly valueZeroHex: string
}