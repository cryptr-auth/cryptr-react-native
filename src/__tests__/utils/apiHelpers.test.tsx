import type { PreparedCryptrConfig } from '../../utils/interfaces';
import {
  decoratedRequestInit,
  refreshTokenUrl,
  revokeTokenUrl,
  sloAfterRevokeTokenUrl,
  ssoSignUrl,
  tokenUrl,
} from '../../utils/apiHelpers';
import Transaction from '../../models/Transaction';
import { Sign } from '../..';

describe('apiHelpers#decoratedRequest/2', () => {
  test('should not decorate if no token', () => {
    let decoratedInit = decoratedRequestInit();
    expect(decoratedInit).toBeUndefined();
  });

  test('should unchange init if no token', () => {
    let decoratedInit = decoratedRequestInit(undefined, {
      headers: { 'x-Admin': 'myself' },
      method: 'PUT',
    });
    expect(decoratedInit).toEqual({
      headers: { 'x-Admin': 'myself' },
      method: 'PUT',
    });
  });

  test('should decorate if token', () => {
    let decoratedInit = decoratedRequestInit('ey1242.fre');
    expect(decoratedInit).toEqual({
      headers: { Authorization: 'Bearer ey1242.fre' },
    });
  });

  test('should merge with init if token', () => {
    let decoratedInit = decoratedRequestInit('ey1242.fre', { method: 'PUT' });
    expect(decoratedInit).toEqual({
      headers: { Authorization: 'Bearer ey1242.fre' },
      method: 'PUT',
    });
  });

  test('should merge headers with inits if token', () => {
    let decoratedInit = decoratedRequestInit('ey1242.fre', {
      headers: { 'x-Admin': 'myself' },
      method: 'PUT',
    });
    expect(decoratedInit).toEqual({
      headers: { 'Authorization': 'Bearer ey1242.fre', 'x-Admin': 'myself' },
      method: 'PUT',
    });
  });

  test('should override Auth header with inits if token', () => {
    let decoratedInit = decoratedRequestInit('ey1242.fre', {
      headers: { Authorization: 'myself' },
      method: 'PUT',
    });
    expect(decoratedInit).toEqual({
      headers: { Authorization: 'Bearer ey1242.fre' },
      method: 'PUT',
    });
  });
});

describe('apiHelpers#tokenUrl/3', () => {
  const config: PreparedCryptrConfig = {
    cryptr_base_url: 'https://cryptr.authent.me',
    tenant_domain: 'shark-academy',
    client_id: '123-aze',
    audience: 'cryptr://app',
    default_redirect_uri: 'cryptr://app',
  };
  const authorization = { authorization_id: 'azerty' };

  it('should return signin token url if sample transaction', () => {
    const transaction = new Transaction(config.default_redirect_uri);
    let url = tokenUrl(config, authorization, transaction);

    expect(url).toEqual(
      `https://cryptr.authent.me/api/v1/tenants/shark-academy/123-aze/${transaction.pkce.state}/oauth/signin/client/${authorization.authorization_id}/token`
    );
  });

  it('should return signin token url if signup transaction', () => {
    const transaction = new Transaction(
      config.default_redirect_uri,
      Sign.SIGNUP
    );

    let url = tokenUrl(config, authorization, transaction);

    expect(url).toEqual(
      `https://cryptr.authent.me/api/v1/tenants/shark-academy/123-aze/${transaction.pkce.state}/oauth/signup/client/${authorization.authorization_id}/token`
    );
  });

  it('should return signup token url using authorization organization', () => {
    const transaction = new Transaction(
      config.default_redirect_uri,
      Sign.SIGNUP
    );

    let url = tokenUrl(
      config,
      { organization_domain: 'misapret', ...authorization },
      transaction
    );

    expect(url).toEqual(
      `https://cryptr.authent.me/api/v1/tenants/misapret/123-aze/${transaction.pkce.state}/oauth/signup/client/${authorization.authorization_id}/token`
    );
  });
});

describe('apiHelpers#ssoSignUrl/3', () => {
  const config: PreparedCryptrConfig = {
    cryptr_base_url: 'https://cryptr.authent.me',
    tenant_domain: 'shark-academy',
    client_id: '123-aze',
    audience: 'cryptr://app',
    default_redirect_uri: 'cryptr://app',
  };
  const idpId = 'shark_academy_po54ze';
  const transaction = new Transaction(config.default_redirect_uri, Sign.SSO);

  it('should return signin token url if sample transaction', () => {
    let url = ssoSignUrl(config, transaction, idpId);

    expect(url).toEqual(
      `https://cryptr.authent.me/enterprise/shark_academy_po54ze/login?client_id=123-aze&redirect_uri=cryptr%3A%2F%2Fapp&locale=en&scope=openid+email+profile&state=${transaction.pkce.state}&code_challenge=${transaction.pkce.codeChallenge}&code_challenge_method=S256`
    );
  });
});

describe('apiHelpers#revokeTokenUrl/1', () => {
  const config: PreparedCryptrConfig = {
    cryptr_base_url: 'https://cryptr.authent.me',
    tenant_domain: 'shark-academy',
    client_id: '123-aze',
    audience: 'cryptr://app',
    default_redirect_uri: 'cryptr://app',
  };

  it('should return signin token url if sample transaction', () => {
    let url = revokeTokenUrl(config);

    expect(url).toEqual(
      'https://cryptr.authent.me/api/v1/tenants/shark-academy/123-aze/oauth/token/revoke'
    );
  });
});

describe('apiHelpers#sloAfterRevokeTokenUrl/2', () => {
  const config: PreparedCryptrConfig = {
    cryptr_base_url: 'https://cryptr.authent.me',
    tenant_domain: 'shark-academy',
    client_id: '123-aze',
    audience: 'cryptr://app',
    default_redirect_uri: 'cryptr://app',
  };
  const sloCode = 'remove_me';

  it('should return signin token url if sample transaction', () => {
    let url = sloAfterRevokeTokenUrl(config, sloCode);

    expect(url).toEqual(
      'https://cryptr.authent.me/api/v1/tenants/shark-academy/123-aze/oauth/token/slo-after-revoke-token?slo_code=remove_me&target_url=cryptr%3A%2F%2Fapp'
    );
  });
});

describe('apiHelpers#refreshTokenUrl/2', () => {
  const config: PreparedCryptrConfig = {
    cryptr_base_url: 'https://cryptr.authent.me',
    tenant_domain: 'shark-academy',
    client_id: '123-aze',
    audience: 'cryptr://app',
    default_redirect_uri: 'cryptr://app',
  };
  const refreshTransaction = new Transaction(
    config.default_redirect_uri,
    Sign.REFRESH
  );

  it('should return signin token url if sample transaction', () => {
    let url = refreshTokenUrl(config, refreshTransaction);

    expect(url).toEqual(
      `https://cryptr.authent.me/api/v1/tenants/shark-academy/123-aze/${refreshTransaction.pkce.state}/oauth/client/token`
    );
  });
});
