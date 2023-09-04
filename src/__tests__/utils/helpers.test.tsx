import Transaction from '../../models/Transaction';
import {
  canProcessSloCode,
  checkDomainValue,
  checkEmailValue,
  extractParamsFromUri,
  logOutBody,
  prepareConfig,
  refreshBody,
  tokensBody,
  universalTokensBody,
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
    no_popup_no_cookie: false,
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
    no_popup_no_cookie: false,
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

describe('helpers#universalTokensBody/3', () => {
  const config: PreparedCryptrConfig = {
    cryptr_base_url: 'https://cryptr.authent.me',
    tenant_domain: 'shark-academy',
    client_id: '123-aze',
    audience: 'cryptr://app',
    default_redirect_uri: 'cryptr://app',
    dedicated_server: false,
    no_popup_no_cookie: false,
  };
  const params = { authorization_id: 'auth_id' };
  const transaction = new Transaction(config.default_redirect_uri, Sign.SSO);

  it('should return universal tokens body object', () => {
    let body = universalTokensBody(transaction, params, config);
    expect(body).toEqual(
      `{"grant_type":"authorization_code","client_id":"123-aze","code_verifier":"${transaction.pkce.codeVerifier}","nonce":"${transaction.nonce}","client_state":"${transaction.pkce.state}"}`
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
      no_popup_no_cookie: false,
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
      no_popup_no_cookie: false,
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
      no_popup_no_cookie: false,
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
      no_popup_no_cookie: false,
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
      no_popup_no_cookie: false,
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
      no_popup_no_cookie: false,
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
      no_popup_no_cookie: false,
    });
  });

  it('should returns chosen no_popup_no_cookie config if provided', () => {
    expect(
      prepareConfig({
        tenant_domain: 'shark_academy',
        client_id: 'client_id',
        audience: 'cryptr://audience',
        default_redirect_uri: 'cryptr://defaultRedirectUri',
        default_locale: 'fr',
        no_popup_no_cookie: true,
      })
    ).toEqual({
      tenant_domain: 'shark_academy',
      client_id: 'client_id',
      audience: 'cryptr://audience',
      default_redirect_uri: 'cryptr://defaultRedirectUri',
      cryptr_base_url: 'https://auth.cryptr.eu',
      default_locale: 'fr',
      dedicated_server: false,
      no_popup_no_cookie: true,
    });
  });
});

describe('helpers#canProcessSloCode/2', () => {
  it('returns false if undefined slo_code', () => {
    expect(canProcessSloCode({ ips: 'cryptr' })).toBeFalsy();
  });

  it('returns false if blank_string slo_code', () => {
    expect(canProcessSloCode({ ips: 'cryptr' }, '')).toBeFalsy();
  });

  it('returns false if right ips, present slo_code but ios platform', () => {
    expect(canProcessSloCode({ ips: 'cryptr' }, 'slo_code', 'ios')).toBeFalsy();
  });

  it('returns false if slo_code, right platform but google ips', () => {
    expect(
      canProcessSloCode({ ips: 'google' }, 'slo_code', 'android')
    ).toBeTruthy();
  });

  it('returns true if string slo_code and ips not google and compatible platform', () => {
    expect(
      canProcessSloCode({ ips: 'cryptr' }, 'slo_code', 'web')
    ).toBeTruthy();
    expect(
      canProcessSloCode({ ips: 'cryptr' }, 'slo_code', 'android')
    ).toBeTruthy();
    expect(
      canProcessSloCode({ ips: 'cryptr' }, 'slo_code', 'macos')
    ).toBeTruthy();
  });
});

describe('helper#checkEmaiValue/1', () => {
  it('returns false if empty string value', () => {
    expect(() => checkEmailValue('')).toThrowError(
      'Please provide non blank string for email'
    );
  });
  it('returns false if wrong string value', () => {
    expect(() => checkEmailValue('azerty')).toThrowError(
      'Please provide valid email'
    );
  });

  it('returns false if @ string value', () => {
    expect(() => checkEmailValue('@')).toThrowError(
      'Please provide valid email'
    );
  });

  it('returns true if simple string value', () => {
    expect(checkEmailValue('john@example.com')).toEqual('john@example.com');
  });

  it('returns true if dotted email string value', () => {
    expect(checkEmailValue('john.doe@example.com')).toEqual(
      'john.doe@example.com'
    );
  });

  it('returns false if ending first part with dots email string value', () => {
    expect(() => checkEmailValue('wrong..@example.com')).toThrowError(
      'Please provide valid email'
    );
  });

  it('returns false if alias email string value', () => {
    expect(() => checkEmailValue('john+alias@example.com')).toThrowError(
      'Please provide valid email'
    );
  });

  it('returns truthy if tiret email string value', () => {
    expect(checkEmailValue('john-doe@example.com')).toEqual(
      'john-doe@example.com'
    );
  });

  it('returns truthy if underscored email string value', () => {
    expect(checkEmailValue('john-doe@example.com')).toEqual(
      'john-doe@example.com'
    );
  });
});

describe('helpers#checkDomainValue/1', () => {
  it('should throw error if empy input', () => {
    expect(() => checkDomainValue(' ')).toThrowError(
      'Please provide non blank string for domain'
    );
  });

  it('should throw error if underscored input', () => {
    expect(() => checkDomainValue('_')).toThrowError(
      'Please provide valid domain (alphanumeric dashed separated)'
    );
  });

  it('should throw error if standard account complex name input', () => {
    expect(() => checkDomainValue("My awesome Company's name")).toThrowError(
      'Please provide valid domain (alphanumeric dashed separated)'
    );
  });

  it('should return value if proper domain input', () => {
    expect(checkDomainValue('communitiz-app')).toEqual('communitiz-app');
  });
});
