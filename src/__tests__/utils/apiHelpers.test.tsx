import Transaction from '../../oauth/Transaction';
import {
  signInUrl,
  domainUrl,
  emailUrl,
  universalTokenUrl,
  universalTokensBody,
  logOutBody,
  revokeTokenUrl,
  refreshBody,
  refreshTokenUrl,
  jsonApiRequest,
} from '../../utils/apiHelpers';
import { Locale } from '../../utils/enums';
import type { PreparedCryptrConfig } from '../../utils/interfaces';

import type { FetchMock } from 'jest-fetch-mock';

const fetchMock = fetch as FetchMock;

const dedicatedConfig: PreparedCryptrConfig = {
  cryptrServiceUrl: 'https://cryptr.authent.me',
  dedicatedServer: true,
  accountDomain: 'communitiz-app',
  clientId: '0e0abbad-b214-47ed-9570-dc531ea21422',
  noPopupNoCookie: false,
  audience: 'cryptr://mobile-app',
  defaultRedirectUri: 'cryptr://mobile-app',
};

const sharedConfig: PreparedCryptrConfig = {
  ...dedicatedConfig,
  dedicatedServer: false,
};

describe('apiHelpers#signUrl/', () => {
  test('should return proper dedicated sign URL', () => {
    let transaction = new Transaction(
      Locale.EN,
      dedicatedConfig.defaultRedirectUri
    );
    let signUrl = signInUrl(dedicatedConfig, transaction);
    let parsedSignUrl = new URL(signUrl);
    expect(parsedSignUrl.hostname).toEqual('cryptr.authent.me');
    expect(parsedSignUrl.pathname).toEqual('/');
    expect(parsedSignUrl.searchParams).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('client_state')).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('scope')).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('code_challenge')).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('client_id')).toEqual(
      dedicatedConfig.clientId
    );
    expect(parsedSignUrl.searchParams.get('locale')).toEqual('en');
    expect(parsedSignUrl.searchParams.get('code_challenge_method')).toEqual(
      'S256'
    );
    expect(parsedSignUrl.searchParams.get('redirect_uri')).toEqual(
      'cryptr://mobile-app'
    );
  });

  test('should return proper shared sign URL', () => {
    let transaction = new Transaction(
      Locale.EN,
      sharedConfig.defaultRedirectUri
    );
    let signUrl = signInUrl(sharedConfig, transaction);
    let parsedSignUrl = new URL(signUrl);
    expect(parsedSignUrl.hostname).toEqual('cryptr.authent.me');
    expect(parsedSignUrl.pathname).toEqual('/a/communitiz-app/');
    expect(parsedSignUrl.searchParams).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('client_state')).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('scope')).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('code_challenge')).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('client_id')).toEqual(
      sharedConfig.clientId
    );
    expect(parsedSignUrl.searchParams.get('locale')).toEqual('en');
    expect(parsedSignUrl.searchParams.get('code_challenge_method')).toEqual(
      'S256'
    );
    expect(parsedSignUrl.searchParams.get('redirect_uri')).toEqual(
      'cryptr://mobile-app'
    );
  });

  test('should allow other redirect uri than default sign URL', () => {
    let transaction = new Transaction(Locale.EN, 'cryptr://app');
    let signUrl = signInUrl(dedicatedConfig, transaction);
    let parsedSignUrl = new URL(signUrl);
    expect(parsedSignUrl.hostname).toEqual('cryptr.authent.me');
    expect(parsedSignUrl.pathname).toEqual('/');
    expect(parsedSignUrl.searchParams).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('client_state')).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('scope')).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('code_challenge')).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('client_id')).toEqual(
      dedicatedConfig.clientId
    );
    expect(parsedSignUrl.searchParams.get('locale')).toEqual('en');
    expect(parsedSignUrl.searchParams.get('code_challenge_method')).toEqual(
      'S256'
    );
    expect(parsedSignUrl.searchParams.get('redirect_uri')).toEqual(
      'cryptr://app'
    );
  });
});

describe('apiHelpers#domainUrl/3', () => {
  test('should returl proper URL with domain query', () => {
    let transaction = new Transaction(
      Locale.EN,
      dedicatedConfig.defaultRedirectUri
    );
    let signUrl = domainUrl(dedicatedConfig, transaction, 'my-domain');
    let parsedSignUrl = new URL(signUrl);
    expect(parsedSignUrl.hostname).toEqual('cryptr.authent.me');
    expect(parsedSignUrl.pathname).toEqual('/');
    expect(parsedSignUrl.searchParams).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('client_state')).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('scope')).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('code_challenge')).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('client_id')).toEqual(
      dedicatedConfig.clientId
    );
    expect(parsedSignUrl.searchParams.get('locale')).toEqual('en');
    expect(parsedSignUrl.searchParams.get('code_challenge_method')).toEqual(
      'S256'
    );
    expect(parsedSignUrl.searchParams.get('redirect_uri')).toEqual(
      'cryptr://mobile-app'
    );
    expect(parsedSignUrl.searchParams.get('domain')).toEqual('my-domain');
  });
});

describe('apiHelpers#emailUrl/3', () => {
  test('should returl proper URL with domain query', () => {
    let transaction = new Transaction(
      Locale.EN,
      dedicatedConfig.defaultRedirectUri
    );
    let signUrl = emailUrl(dedicatedConfig, transaction, 'me@example.com');
    let parsedSignUrl = new URL(signUrl);
    expect(parsedSignUrl.hostname).toEqual('cryptr.authent.me');
    expect(parsedSignUrl.pathname).toEqual('/');
    expect(parsedSignUrl.searchParams).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('client_state')).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('scope')).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('code_challenge')).not.toBeNull();
    expect(parsedSignUrl.searchParams.get('client_id')).toEqual(
      dedicatedConfig.clientId
    );
    expect(parsedSignUrl.searchParams.get('locale')).toEqual('en');
    expect(parsedSignUrl.searchParams.get('code_challenge_method')).toEqual(
      'S256'
    );
    expect(parsedSignUrl.searchParams.get('redirect_uri')).toEqual(
      'cryptr://mobile-app'
    );
    expect(parsedSignUrl.searchParams.get('email')).toEqual('me@example.com');
  });
});

describe('apiHelpers#universalTokenUrl/3', () => {
  test('should returl proper URL with domain query', () => {
    let signUrl = universalTokenUrl(sharedConfig, 'some-org-domain');
    let parsedSignUrl = new URL(signUrl);
    expect(parsedSignUrl.hostname).toEqual('cryptr.authent.me');
    expect(parsedSignUrl.pathname).toEqual('/org/some-org-domain/oauth2/token');
  });

  test('should returl proper URL even if shared instance with domain query', () => {
    let signUrl = universalTokenUrl(sharedConfig, 'some-org-domain');
    let parsedSignUrl = new URL(signUrl);
    expect(parsedSignUrl.hostname).toEqual('cryptr.authent.me');
    expect(parsedSignUrl.pathname).toEqual('/org/some-org-domain/oauth2/token');
  });
});

describe('apiHelpers#universalTokensBody/', () => {
  test('should return proper stringified json if right params', () => {
    let transaction = new Transaction(
      Locale.EN,
      dedicatedConfig.defaultRedirectUri
    );
    let params = { code: 'code', request_id: 'request_id' };
    let tokensBody = universalTokensBody(transaction, params, dedicatedConfig);
    expect(tokensBody).not.toBeNull();
    expect(JSON.parse(tokensBody)).toEqual({
      client_id: dedicatedConfig.clientId,
      client_state: transaction.pkce.state,
      code: 'code',
      request_id: 'request_id',
      code_verifier: transaction.pkce.codeVerifier,
      grant_type: 'authorization_code',
      nonce: transaction.nonce,
    });
  });

  test('should fail if wrong params', () => {
    let transaction = new Transaction(
      Locale.EN,
      dedicatedConfig.defaultRedirectUri
    );
    let params = {};
    let tokensBody = universalTokensBody(transaction, params, dedicatedConfig);
    expect(tokensBody).not.toBeNull();
    expect(JSON.parse(tokensBody)).toEqual({
      client_id: dedicatedConfig.clientId,
      client_state: transaction.pkce.state,
      code_verifier: transaction.pkce.codeVerifier,
      grant_type: 'authorization_code',
      nonce: transaction.nonce,
    });
  });
});

describe('apiHelpers#logoutBody/3', () => {
  test('should return proper JSON payload when access token used', () => {
    let logoutBody = logOutBody(dedicatedConfig, 'my-current-access-token');
    expect(logOutBody).not.toBeNull();
    if (logoutBody) {
      expect(JSON.parse(logoutBody)).toEqual({
        token: 'my-current-access-token',
        token_type_hint: 'access_token',
        client_id: dedicatedConfig.clientId,
      });
    }
  });

  test('should return proper JSON payload when refersh token used', () => {
    let logoutBody = logOutBody(
      dedicatedConfig,
      undefined,
      'my-current-refresh-token'
    );
    expect(logoutBody).not.toBeNull();
    if (logoutBody) {
      expect(JSON.parse(logoutBody)).toEqual({
        token: 'my-current-refresh-token',
        token_type_hint: 'refresh_token',
        client_id: dedicatedConfig.clientId,
      });
    }
  });

  test('should return undefined if missing token', () => {
    let logoutBody = logOutBody(dedicatedConfig);
    expect(logoutBody).toBeUndefined();
  });
});

describe('apiHelpers#revokeTokenUrl', () => {
  test('should return proper URL if dedicated service', () => {
    let revokeUrl = revokeTokenUrl(dedicatedConfig);
    expect(revokeUrl).toEqual('https://cryptr.authent.me/oauth/revoke');
  });

  test('should return proper URL if shared service', () => {
    let revokeUrl = revokeTokenUrl(dedicatedConfig);
    expect(revokeUrl).toEqual('https://cryptr.authent.me/oauth/revoke');
  });
});

describe('apiHelpers#refreshBody/3', () => {
  test('should return proper body', () => {
    let transaction = new Transaction(
      Locale.EN,
      dedicatedConfig.defaultRedirectUri
    );
    let body = refreshBody('my-refresh-token', transaction, dedicatedConfig);
    expect(body).not.toBeNull();
    expect(JSON.parse(body)).toEqual({
      client_id: dedicatedConfig.clientId,
      grant_type: 'refresh_token',
      nonce: transaction.nonce,
      token: 'my-refresh-token',
    });
  });
});

describe('apiHelpers#refreshTokenUrl/1', () => {
  test('should return proper URL when dedicated', () => {
    let url = refreshTokenUrl(dedicatedConfig);
    expect(url).toEqual('https://cryptr.authent.me/oauth/token');
  });

  test('should return proper URL when shared', () => {
    let url = refreshTokenUrl(sharedConfig);
    expect(url).toEqual('https://cryptr.authent.me/oauth/token');
  });
});

describe('apiHelper.jsonApiRequest/3', () => {
  test('should call fetch with proper params', async () => {
    const rest = await jsonApiRequest(
      'http://lvh.me:4000',
      '{"key": "value"}',
      'GET'
    );
    expect(fetchMock).toHaveBeenCalledWith('http://lvh.me:4000', {
      body: '{"key": "value"}',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    expect(rest).not.toBeNull();
  });

  test('should call fetch with POST method if no method given', async () => {
    const rest = await jsonApiRequest('http://lvh.me:4000', '{"key": "value"}');
    expect(fetchMock).toHaveBeenCalledWith('http://lvh.me:4000', {
      body: '{"key": "value"}',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    expect(rest).not.toBeNull();
  });
});
