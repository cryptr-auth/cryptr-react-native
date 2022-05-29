import uuid from 'react-native-uuid';
const CryptoJS = require('crypto-js');

class Pkce {
  readonly state: string = uuid.v4().toString();
  readonly codeVerifier: string = base64UrlEncode(uuid.v4().toString());
  readonly codeChallengeMethod: string = 'S256';
  codeChallenge: string = 'not_initialized';

  constructor() {
    this.codeChallenge = base64UrlEncode(
      CryptoJS.SHA256(this.codeVerifier).toString(CryptoJS.enc.Base64)
    );
  }
}

const base64UrlEncode = (str: string) => {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]/g, '');
};

export default Pkce;
