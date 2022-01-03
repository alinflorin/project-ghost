/// <reference lib="webworker" />

importScripts(`/assets/js/cryptico.js`);
declare var cryptico: any;
const api = cryptico.cryptico;
(function (c) {
  var parametersBigint = ["n", "d", "p", "q", "dmp1", "dmq1", "coeff"];

  c.privateKeyString = function (rsakey: any) {
    var keyObj: any = {};
    parametersBigint.forEach(function (parameter) {
      keyObj[parameter] = c.b16to64(rsakey[parameter].toString(16));
    });
    return JSON.stringify(keyObj);
  };
  c.privateKeyFromString = function (string: string) {
    var keyObj = JSON.parse(string);
    var rsa: any = new cryptico.RSAKey();
    parametersBigint.forEach(function (parameter) {
      rsa[parameter] = cryptico.parseBigInt(c.b64to16(keyObj[parameter].split("|")[0]), 16);
    });
    rsa.e = parseInt("03", 16);
    return rsa;
  };
})(api);

addEventListener('message', ({ data }) => {
  try {
    let r: any = null;
    switch (data.type) {
      case 0:
        const rsaKeyBits = api.generateRSAKey(data.data.passphrase, 512);
        r = {
          rsaKey: api.privateKeyString(rsaKeyBits),
          publicKey: api.publicKeyString(rsaKeyBits)
        };
        break;

      case 1:
        const rsaKey = api.privateKeyFromString(data.data.bundle.rsaKey);
        const encoded = api.encrypt(data.data.text, data.data.bundle.publicKey, rsaKey);
        if (encoded.status !== 'success') {
          throw { error: 'Encryption failed' };
        }
        r = encoded.cipher;
        break;

      case 2:
        const rsaKey2 = api.privateKeyFromString(data.data.bundle.rsaKey);
        const decoded = api.decrypt(data.data.encrypted, rsaKey2);
        if (decoded.status !== 'success') {
          throw { error: 'Decryption failed' };
        }
        r = decoded.plaintext;
        break;
      default:
        throw { error: 'Unknown message' };
    }
    const rObj: any = {};
    rObj.data = r;
    rObj.id = data.id;
    postMessage(rObj);
  } catch (err: any) {
    err.id = data.id;
    throw err;
  }
});
