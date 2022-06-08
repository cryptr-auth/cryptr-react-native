// URL Builders

import type Transaction from 'src/models/Transaction';
import { Locale } from './enums';
import { organizationDomain } from './helpers';
import type { PreparedCryptrConfig } from './interfaces';

type QueryParam<T, K> = [T, K];
type QueryParams<T, K> = QueryParam<T, K>[];

const urlBuilder = (
  urlParts: Array<string>,
  queryParams?: QueryParams<string, string>
): string => {
  let url = new URL(urlParts.join('/'));
  if (queryParams) {
    queryParams.forEach((queryParam) => {
      url.searchParams.append(queryParam[0], queryParam[1]);
    });
  }

  return url.href;
};

export const tokenUrl = (
  config: PreparedCryptrConfig,
  authorization: any,
  transaction: Transaction
): string => {
  const {
    signType,
    pkce: { state: pkceState },
  } = transaction;
  const { authorization_id, organization_domain } = authorization;
  let domain = organization_domain || config.tenant_domain;
  let urlParts = [
    config.cryptr_base_url,
    'api',
    'v1',
    'tenants',
    domain,
    config.client_id,
    pkceState,
    'oauth',
    signType,
    'client',
    authorization_id,
    'token',
  ];
  return urlBuilder(urlParts);
};

export const ssoSignUrl = (
  config: PreparedCryptrConfig,
  ssoTransaction: Transaction,
  idpId: string
): string => {
  const { cryptr_base_url, client_id } = config;
  const {
    redirectUri,
    locale,
    scope,
    pkce: { state: pkceState, codeChallenge, codeChallengeMethod },
  } = ssoTransaction;
  let queryParams = [
    ['client_id', client_id] as QueryParam<string, string>,
    ['redirect_uri', redirectUri] as QueryParam<string, string>,
    ['locale', locale] as QueryParam<string, string>,
    ['scope', scope] as QueryParam<string, string>,
    ['state', pkceState] as QueryParam<string, string>,
    ['code_challenge', codeChallenge] as QueryParam<string, string>,
    ['code_challenge_method', codeChallengeMethod] as QueryParam<
      string,
      string
    >,
  ];
  let urlParts = [cryptr_base_url, 'enterprise', idpId, 'login'];
  return urlBuilder(urlParts, queryParams);
};

export const ssoGatewayUrl = (
  config: PreparedCryptrConfig,
  ssoTransaction: Transaction,
  idpId?: string | string[]
) => {
  const { cryptr_base_url, client_id, dedicated_server, tenant_domain } =
    config;
  const cryptrBaseUrl = dedicated_server
    ? cryptr_base_url
    : [cryptr_base_url, 't', tenant_domain, ''].join('/');
  const {
    redirectUri,
    scope,
    pkce: { state: clientState, codeChallenge, codeChallengeMethod },
  } = ssoTransaction;
  const locale = ssoTransaction.locale || config.default_locale || Locale.EN;
  let queryParams = [
    ['client_id', client_id] as QueryParam<string, string>,
    ['locale', locale] as QueryParam<string, string>,
    ['client_state', clientState] as QueryParam<string, string>,
    ['scope', scope] as QueryParam<string, string>,
    ['redirect_uri', redirectUri] as QueryParam<string, string>,
    ['code_challenge', codeChallenge] as QueryParam<string, string>,
    ['code_challenge_method', codeChallengeMethod] as QueryParam<
      string,
      string
    >,
  ];
  if (idpId) {
    if (typeof idpId === 'string') {
      queryParams.push(['idp_id', idpId] as QueryParam<string, string>);
    } else {
      idpId.forEach((idp_id) => {
        queryParams.push(['idp_ids[]', idp_id] as QueryParam<string, string>);
      });
    }
  }
  return urlBuilder([cryptrBaseUrl], queryParams);
};

export const revokeTokenUrl = (
  config: PreparedCryptrConfig,
  refreshToken: string
): string => {
  const { cryptr_base_url, tenant_domain, client_id } = config;
  let domain = organizationDomain(refreshToken) || tenant_domain;
  let urlParts = [
    cryptr_base_url,
    'api',
    'v1',
    'tenants',
    domain,
    client_id,
    'oauth',
    'token',
    'revoke',
  ];
  return urlBuilder(urlParts);
};

export const sloAfterRevokeTokenUrl = (
  config: PreparedCryptrConfig,
  sloCode: string
): string => {
  const { cryptr_base_url, tenant_domain, client_id, default_redirect_uri } =
    config;
  let urlParts = [
    cryptr_base_url,
    'api',
    'v1',
    'tenants',
    tenant_domain,
    client_id,
    'oauth',
    'token',
    'slo-after-revoke-token',
  ];
  let queryParams = [
    ['slo_code', sloCode] as QueryParam<string, string>,
    ['target_url', default_redirect_uri] as QueryParam<string, string>,
  ];
  return urlBuilder(urlParts, queryParams);
};

export const refreshTokenUrl = (
  config: PreparedCryptrConfig,
  refreshTransaction: Transaction,
  refreshToken: string
): string => {
  const { cryptr_base_url, tenant_domain, client_id } = config;
  const {
    pkce: { state: pkceState },
  } = refreshTransaction;
  let domain = organizationDomain(refreshToken) || tenant_domain;
  let urlParts = [
    cryptr_base_url,
    'api',
    'v1',
    'tenants',
    domain,
    client_id,
    pkceState,
    'oauth',
    'client',
    'token',
  ];
  return urlBuilder(urlParts);
};

export const decoratedRequestInit = (
  accessToken?: string,
  init?: RequestInit
) => {
  return accessToken
    ? {
        ...init,
        headers: { ...init?.headers, Authorization: `Bearer ${accessToken}` },
      }
    : init;
};

export const jsonApiRequest = (
  url: string,
  body?: string,
  method?: string
): Promise<Response> => {
  return fetch(url, {
    method: method || 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: body,
  });
};
