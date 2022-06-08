import Transaction from '../../models/Transaction';
import {
  extractParamsFromUri,
  logOutBody,
  prepareConfig,
  refreshBody,
  tokensBody,
} from '../../utils/helpers';
import type { PreparedCryptrConfig } from '../../utils/interfaces';
import { Sign } from '../..';

describe('helpers#refreshBody/3', () => {
  const config: PreparedCryptrConfig = {
    cryptr_base_url: 'https://cryptr.authent.me',
    tenant_domain: 'shark-academy',
    client_id: '123-aze',
    audience: 'cryptr://app',
    default_redirect_uri: 'cryptr://app',
    dedicated_server: false,
  };
  const refreshToken = 'shark_academy_po54ze';
  const refreshTransaction = new Transaction(
    config.default_redirect_uri,
    Sign.SSO
  );

  it('should return build refresh body object', () => {
    let body = refreshBody(refreshToken, refreshTransaction, config);
    expect(body).toEqual(
      `{"client_id":"123-aze","grant_type":"refresh_token","nonce":"${refreshTransaction.nonce}","refresh_token":"shark_academy_po54ze"}`
    );
  });
});

describe('helpers#tokensBody/3', () => {
  const config: PreparedCryptrConfig = {
    cryptr_base_url: 'https://cryptr.authent.me',
    tenant_domain: 'shark-academy',
    client_id: '123-aze',
    audience: 'cryptr://app',
    default_redirect_uri: 'cryptr://app',
    dedicated_server: false,
  };
  const params = { authorization_id: 'auth_id' };
  const transaction = new Transaction(config.default_redirect_uri, Sign.SSO);

  it('should return build tokens body object', () => {
    let body = tokensBody(transaction, params, config);
    expect(body).toEqual(
      `{"authorization_id":"auth_id","client_id":"123-aze","code":"123-aze","code_verifier":"${transaction.pkce.codeVerifier}","grant_type":"authorization_code","nonce":"${transaction.nonce}"}`
    );
  });
});

describe('helpers#logOutBody/2', () => {
  it('should return build logout body object with access', () => {
    let body = logOutBody('my_access_token');
    expect(body).toEqual(
      '{"token":"my_access_token","token_type_hint":"access_token"}'
    );
  });

  it('should return build logout body object with refresh', () => {
    let body = logOutBody(undefined, 'my_refresh_token');
    expect(body).toEqual(
      '{"token":"my_refresh_token","token_type_hint":"refresh_token"}'
    );
  });

  it('should return build logout body object with refresh prior', () => {
    let body = logOutBody('undefined', 'my_refresh_token');
    expect(body).toEqual(
      '{"token":"my_refresh_token","token_type_hint":"refresh_token"}'
    );
  });

  it('should return undefined without any token', () => {
    let body = logOutBody();
    expect(body).toBeUndefined();
  });
});

describe('helpers#extractParamsFromUri/1', () => {
  it('should returns key-pair object if any query param', () => {
    expect(
      extractParamsFromUri('http://api.example.com/v1/data?p1=d1&sd2=42')
    ).toEqual({ p1: 'd1', sd2: '42' });
  });
});

describe('helpers#prepareConfig/1', () => {
  it('should returns default config if minimum conf', () => {
    expect(
      prepareConfig({
        tenant_domain: 'shark_academy',
        client_id: 'client_id',
        audience: 'cryptr://audience',
        default_redirect_uri: 'cryptr://defaultRedirectUri',
      })
    ).toEqual({
      tenant_domain: 'shark_academy',
      client_id: 'client_id',
      audience: 'cryptr://audience',
      default_redirect_uri: 'cryptr://defaultRedirectUri',
      cryptr_base_url: 'https://auth.cryptr.eu',
      default_locale: 'en',
      dedicated_server: false,
    });
  });

  it('should returns chosen base url config if provided', () => {
    expect(
      prepareConfig({
        tenant_domain: 'shark_academy',
        client_id: 'client_id',
        audience: 'cryptr://audience',
        default_redirect_uri: 'cryptr://defaultRedirectUri',
        cryptr_base_url: 'https://shark-academy.authent.me',
      })
    ).toEqual({
      tenant_domain: 'shark_academy',
      client_id: 'client_id',
      audience: 'cryptr://audience',
      default_redirect_uri: 'cryptr://defaultRedirectUri',
      cryptr_base_url: 'https://shark-academy.authent.me',
      default_locale: 'en',
      dedicated_server: false,
    });
  });

  it('should returns eu base url config if eu region provided', () => {
    expect(
      prepareConfig({
        tenant_domain: 'shark_academy',
        client_id: 'client_id',
        audience: 'cryptr://audience',
        default_redirect_uri: 'cryptr://defaultRedirectUri',
        region: 'eu',
      })
    ).toEqual({
      tenant_domain: 'shark_academy',
      client_id: 'client_id',
      audience: 'cryptr://audience',
      default_redirect_uri: 'cryptr://defaultRedirectUri',
      cryptr_base_url: 'https://auth.cryptr.eu',
      default_locale: 'en',
      dedicated_server: false,
    });
  });

  it('should returns us base url config if us region provided', () => {
    expect(
      prepareConfig({
        tenant_domain: 'shark_academy',
        client_id: 'client_id',
        audience: 'cryptr://audience',
        default_redirect_uri: 'cryptr://defaultRedirectUri',
        region: 'us',
      })
    ).toEqual({
      tenant_domain: 'shark_academy',
      client_id: 'client_id',
      audience: 'cryptr://audience',
      default_redirect_uri: 'cryptr://defaultRedirectUri',
      cryptr_base_url: 'https://auth.cryptr.us',
      default_locale: 'en',
      dedicated_server: false,
    });
  });

  it('should returns chosen base url config even if region provided', () => {
    expect(
      prepareConfig({
        tenant_domain: 'shark_academy',
        client_id: 'client_id',
        audience: 'cryptr://audience',
        default_redirect_uri: 'cryptr://defaultRedirectUri',
        cryptr_base_url: 'https://shark-academy.authent.me',
        region: 'us',
      })
    ).toEqual({
      tenant_domain: 'shark_academy',
      client_id: 'client_id',
      audience: 'cryptr://audience',
      default_redirect_uri: 'cryptr://defaultRedirectUri',
      cryptr_base_url: 'https://shark-academy.authent.me',
      default_locale: 'en',
      dedicated_server: false,
    });
  });

  it('should returns chosen locale config if provided', () => {
    expect(
      prepareConfig({
        tenant_domain: 'shark_academy',
        client_id: 'client_id',
        audience: 'cryptr://audience',
        default_redirect_uri: 'cryptr://defaultRedirectUri',
        default_locale: 'fr',
      })
    ).toEqual({
      tenant_domain: 'shark_academy',
      client_id: 'client_id',
      audience: 'cryptr://audience',
      default_redirect_uri: 'cryptr://defaultRedirectUri',
      cryptr_base_url: 'https://auth.cryptr.eu',
      default_locale: 'fr',
      dedicated_server: false,
    });
  });

  it('should returns chosen dedicated_server config if provided', () => {
    expect(
      prepareConfig({
        tenant_domain: 'shark_academy',
        client_id: 'client_id',
        audience: 'cryptr://audience',
        default_redirect_uri: 'cryptr://defaultRedirectUri',
        default_locale: 'fr',
        dedicated_server: true,
      })
    ).toEqual({
      tenant_domain: 'shark_academy',
      client_id: 'client_id',
      audience: 'cryptr://audience',
      default_redirect_uri: 'cryptr://defaultRedirectUri',
      cryptr_base_url: 'https://auth.cryptr.eu',
      default_locale: 'fr',
      dedicated_server: true,
    });
  });
});
