export interface NetworkCreateParams {
  readonly chainIdString: string
  readonly contractZeroHex: string
  readonly receiverZeroHex: string
  readonly nonceZeroHex: string
}

export interface NetworkGenerateResult {
  readonly secretZeroHex: string
  readonly proofZeroHex: string
}