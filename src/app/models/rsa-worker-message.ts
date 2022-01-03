export enum RsaMessageType {
  GenerateKey = 0,
  Encrypt = 1,
  Decrypt = 2
}

export interface RsaWorkerMessage {
  type: RsaMessageType;
  data: any | undefined;
  id?: string;
}
