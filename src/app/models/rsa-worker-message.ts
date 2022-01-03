export enum RsaMessageType {
  GenerateKeyRequest = 0,
  GenerateKeyResponse = 1
}

export interface RsaWorkerMessage {
  type: RsaMessageType;
  data: any | undefined;
}
