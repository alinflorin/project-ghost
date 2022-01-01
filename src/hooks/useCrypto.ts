import { useCallback, useEffect, useState } from 'react';
import { RSAKey, cryptico } from '@daotl/cryptico';
import { RsaBundle } from '../models/rsa-bundle';

export const useCrypto = (key: string | undefined | null) => {
    const [rsa, setRsa] = useState<RsaBundle | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (key == null) {
            return;
        }
        setLoading(true);
        (async () => {
            const rsaKey = cryptico.generateRSAKey(key, 2048);
            const pubKey = cryptico.publicKeyString(rsaKey);
            setRsa({
                pubKey: pubKey,
                rsaKey: rsaKey
            });
            setLoading(false);
        })();
    }, [key, setRsa]);

    const encrypt = useCallback((plain: string | undefined | null) => {
        if (!rsa) {
            throw new Error('Invalid key');
        }
        if (!plain) {
            return plain;
        }
        const result = cryptico.encrypt(plain, rsa.pubKey, rsa.rsaKey);
        if (result.status !== 'success') {
            throw new Error('Encryption failed');
        }
        return (result as any).cipher as string;
    }, [rsa]);

    const decrypt = useCallback((encrypted: string | undefined | null) => {
        if (!rsa) {
            throw new Error('Invalid key');
        }
        if (!encrypted) {
            return encrypted;
        }
        const result = cryptico.decrypt(encrypted!, rsa.rsaKey);
        if (result.status !== 'success') {
            throw new Error('Decryption failed');
        }
        return result.plaintext;
    }, [rsa]);

    return { encrypt, decrypt, rsaLoading: loading };
};

export default useCrypto;