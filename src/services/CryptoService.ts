const cryptoJS = require('node-cryptojs-aes').CryptoJS;
import * as crypto from 'crypto';
import { getSettingValue } from './SettingService';

export function encryptString (data : string, secret? : string) : string {
    secret = secret || getSettingValue('CryptoSecretKey');
    return encodeURI(cryptoJS.AES.encrypt(data, secret).toString());
}

export function decryptString (value : string, secret?: string) : any {
    if(!value)
        return undefined;
    secret = secret || getSettingValue('CryptoSecretKey');
    return cryptoJS.enc.Utf8.stringify(cryptoJS.AES.decrypt(decodeURI(value), secret));
}

export function encryptJSON (data : any, secret? : string) : string {
    return encryptString(JSON.stringify(data), secret);
}

export function decryptJSON (value : string, secret?: string) : any {
    return JSON.parse(decryptString(value, secret));
}

export function randomString(length : number = 32) {
    return crypto.randomBytes(length).toString('hex') ;
}


export function encryptBuffer (data: Buffer, secret? : string) : Buffer {
    secret = secret || getSettingValue('CryptoSecretKey');

    // Create key from secret
    const key = crypto.createHash('sha256').update(secret).digest('base64').substr(0, 32);  

    // Create an initialization vector
    const iv = crypto.randomBytes(16);

    // Create a new cipher using the algorithm, key, and iv
    const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);

    // Create the new (encrypted) buffer
    return Buffer.concat([iv, cipher.update(data), cipher.final()]);
}

export function decryptBuffer (data: Buffer, secret? : string) : Buffer {
    secret = secret || getSettingValue('CryptoSecretKey');

    // Create key from secret
    const key = crypto.createHash('sha256').update(secret).digest('base64').substr(0, 32);  

    // Get the iv: the first 16 bytes
    const iv = data.slice(0, 16);

    // Get the rest
    data = data.slice(16);
   
    // Create a decipher
    const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
    
    // Actually decrypt it
    return Buffer.concat([decipher.update(data), decipher.final()]);
}
