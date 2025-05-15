// Here will be all the functions that have the same utilities as in diverse.js, but there I have conflicts when importing from Firebase.js.
import * as Crypto from 'expo-crypto';
import { EnvConfig } from './EnvConfig.js';

async function digestCrypto(value){
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256, value
  );
}

async function authorizationHeaders(body){
  const token = await digestCrypto(JSON.stringify(body) +  EnvConfig.getInstance().get('authorization_custom_token'));
  return {
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    }
  }
}

export { authorizationHeaders };