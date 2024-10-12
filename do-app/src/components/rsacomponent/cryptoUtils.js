  export const logChunks = (label, data) => {
    const chunks = [];
    for (let i = 0; i < data.length; i += 256) {
      chunks.push(data.substring(i, i + 256));
    }
    return chunks;
  };
  
  export const encryptPrivateKey = async (privateKeyBase64, password) => {
    const enc = new TextEncoder();
  
    const passwordHash = await crypto.subtle.digest('SHA-256', enc.encode(password));
  
    const key = await crypto.subtle.importKey(
      'raw',
      passwordHash,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
  
    const iv = new Uint8Array(passwordHash).slice(0, 12);
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      enc.encode(privateKeyBase64)
    );
  
    const encryptedBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
  
    return encryptedBase64;
  };
  
  export const decryptPrivateKey = async (encryptedPrivateKeyBase64, password) => {
    const enc = new TextEncoder();
  
    const passwordHash = await crypto.subtle.digest('SHA-256', enc.encode(password));
  
    const key = await crypto.subtle.importKey(
      'raw',
      passwordHash,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
  
    const iv = new Uint8Array(passwordHash).slice(0, 12);
    const encryptedPrivateKeyArray = Uint8Array.from(atob(encryptedPrivateKeyBase64), c => c.charCodeAt(0));
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encryptedPrivateKeyArray
    );
  
    return new TextDecoder().decode(decrypted);
  };
  
  export const encryptTextWithPublicKey = async (text, publicKeyBase64) => {
    try {
      const enc = new TextEncoder();
      const publicKeyArray = Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0));
      const publicKey = await crypto.subtle.importKey(
        'spki',
        publicKeyArray,
        { name: 'RSA-OAEP', hash: { name: 'SHA-256' } },
        false,
        ['encrypt']
      );
  
      const encrypted = await crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        publicKey,
        enc.encode(text)
      );
  
      return btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
    } catch (error) {
      alert('⚠️Error encrypting text:', error);
      return null;
    }
  };
  
  export const decryptTextWithPrivateKey = async (encryptedText, privateKeyBase64) => {
    try {
      const privateKeyArray = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0));
      const privateKey = await crypto.subtle.importKey(
        'pkcs8',
        privateKeyArray,
        { name: 'RSA-OAEP', hash: { name: 'SHA-256' } },
        false,
        ['decrypt']
      );
  
      const encryptedArray = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
      const decrypted = await crypto.subtle.decrypt(
        { name: 'RSA-OAEP' },
        privateKey,
        encryptedArray
      );
  
      return new TextDecoder().decode(decrypted);
    } catch (error) {      
      return `Error decrypting: ${error}`;   
    }
  };
  
  export const generateKeys = async () => {
    try {
      const keys = await crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: { name: 'SHA-256' }
        },
        true,
        ['encrypt', 'decrypt']
      );
  
      const exportedPublicKey = await crypto.subtle.exportKey('spki', keys.publicKey);
      const exportedPrivateKey = await crypto.subtle.exportKey('pkcs8', keys.privateKey);
  
      const publicKeyBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedPublicKey)));
      const privateKeyBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedPrivateKey)));
  
      return { publicKeyBase64, privateKeyBase64 };
    } catch (error) {
      throw new Error('⚠️Error generating keys:', error);
    }
  };

  // export const encryptRSA = async (publicKeyText, plaintext) => {
  //   try {
  //     const publicKey = await importPublicKey(publicKeyText);

  //     const encrypted = await crypto.subtle.encrypt(
  //       {
  //         name: 'RSA-OAEP'
  //       },
  //       publicKey,
  //       new TextEncoder().encode(plaintext)
  //     );

  //     const base64EncodedEncryptedMessage = btoa(String.fromCharCode(...new Uint8Array(encrypted)));     

  //     return base64EncodedEncryptedMessage;
  //   } catch (error) {
  //     console.error('Error encrypting:', error);
  //     alert('⚠️Error encrypting:', error)
  //   }
  // };

  // export const decryptRSA = async (privateKeyText, encryptedMessage) => {
  //   try {
  //     const privateKey = await importPrivateKey(privateKeyText);

  //     const encryptedUint8Array = new Uint8Array(atob(encryptedMessage).split('').map(char => char.charCodeAt(0)));
  //     const decrypted = await crypto.subtle.decrypt(
  //       {
  //         name: 'RSA-OAEP'
  //       },
  //       privateKey,
  //       encryptedUint8Array
  //     );

  //     return new TextDecoder().decode(decrypted);
  //   } catch (error) {
  //     //console.error('Error decrypting:', error);
  //     return `Error decrypting: ${error}`;    
  //   }
  // };

  // const importPublicKey = async (publicKeyText) => {
  //   const publicKeyArrayBuffer = Uint8Array.from(atob(publicKeyText), c => c.charCodeAt(0)).buffer;
  //   return await crypto.subtle.importKey(
  //     'spki',
  //     publicKeyArrayBuffer,
  //     {
  //       name: 'RSA-OAEP',
  //       hash: { name: 'SHA-256' }
  //     },
  //     false,
  //     ['encrypt']
  //   );
  // };

  // const importPrivateKey = async (privateKeyText) => {
  //   const privateKeyArrayBuffer = Uint8Array.from(atob(privateKeyText), c => c.charCodeAt(0)).buffer;
  //   return await crypto.subtle.importKey(
  //     'pkcs8',
  //     privateKeyArrayBuffer,
  //     {
  //       name: 'RSA-OAEP',
  //       hash: { name: 'SHA-256' }
  //     },
  //     false,
  //     ['decrypt']
  //   );
  // };
  