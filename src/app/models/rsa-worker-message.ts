export enum RsaMessageType {
  GenerateKeyRequest = 0,
  GenerateKeyResponse = 1,
  EncryptRequest = 2,
  EncryptResponse = 3
}

export interface RsaWorkerMessage {
  type: RsaMessageType;
  data: any | undefined;
}
