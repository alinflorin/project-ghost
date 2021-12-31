import { RSAKey } from '@daotl/cryptico';

export interface RsaBundle {
    rsaKey: RSAKey;
    pubKey: string;
}