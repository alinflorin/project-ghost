import { useCallback, useEffect, useState } from 'react';

const sc = window.crypto.subtle;
const textEncoder = new TextEncoder();

export const useCrypto = (key: string | undefined | null) => {
    const [rsa, setRsa] = useState<CryptoKeyPair | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (key == null) {
            return;
        }
        setLoading(true);
        (async () => {
            const keyArr = textEncoder.encode(key);
            console.log(keyArr);
            const genKey = await sc.generateKey({
                name: "RSA-OAEP",
                modulusLength: 4096,
                publicExponent: keyArr,
                hash: "SHA-256"
            },
                true,
                ["encrypt", "decrypt"]);
            setRsa(genKey);
            setLoading(false);
        })();
    }, [key, setRsa]);

    const encrypt = useCallback(async (plain: string | undefined | null) => {
        if (!rsa) {
            throw new Error('Invalid key');
        }
        if (!plain) {
            return plain;
        }
        const result = await sc.encrypt('RSA-OAEP', rsa.privateKey!, textEncoder.encode(plain));
        console.log(result);
        return result;
    }, [rsa]);

    const decrypt = useCallback(async (encrypted: any | undefined | null) => {
        if (!rsa) {
            throw new Error('Invalid key');
        }
        if (!encrypted) {
            return encrypted;
        }
        const result = await sc.decrypt('RSA-OAEP', rsa.publicKey!, encrypted);
        console.log(result);
        return result;
    }, [rsa]);

    return { encrypt, decrypt, rsaLoading: loading };
};

export default useCrypto;