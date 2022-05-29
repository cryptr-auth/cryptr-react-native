import Pkce from '../../models/Pkce';

const CryptoJS = require('crypto-js');

describe('Pkce', () => {
  it('should auto generate values on init', () => {
    let pkce = new Pkce();
    expect(pkce.codeChallengeMethod).toEqual('S256');
    expect(pkce.state).not.toBeUndefined();
    expect(pkce.codeVerifier).not.toBeUndefined();
    expect(pkce.codeChallenge).not.toBeUndefined();
  });

  it('should generate proper codeChallenge from codeVerifier on init', () => {
    let pkce = new Pkce();
    expect(pkce.codeChallengeMethod).toEqual('S256');
    expect(pkce.codeChallenge).toEqual(
      CryptoJS.SHA256(pkce.codeVerifier)
        .toString(CryptoJS.enc.Base64)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/[=]/g, '')
    );
  });
});
