import type Transaction from '../oauth/Transaction';
import { Locale } from './enums';
import type { IHash, PreparedCryptrConfig } from './interfaces';

export const signInUrl = (
  config: PreparedCryptrConfig,
  transaction: Transaction,
  newKey?: string,
  newValue?: any
): string => {
  const { accountDomain, clientId, cryptrServiceUrl, dedicatedServer } = config;
  const cryptrBaseUrl = dedicatedServer
    ? cryptrServiceUrl
    : [cryptrServiceUrl, 'a', accountDomain, ''].join('/');
  const {
    pkce: { codeChallenge, codeChallengeMethod, state: clientState },
    redirectUri,
    scope,
  } = transaction;
  const locale = transaction.locale || config.defaultLocale || Locale.EN;
  let baseParams = new URLSearchParams();
  baseParams.append('client_id', clientId);
  baseParams.append('client_state', clientState);
  baseParams.append('code_challenge', codeChallenge);
  baseParams.append('code_challenge_method', codeChallengeMethod);
  baseParams.append('locale', locale);
  baseParams.append('redirect_uri', redirectUri);
  baseParams.append('scope', scope);
  if (newKey !== undefined && newValue !== undefined) {
    baseParams.append(newKey, newValue);
  }
  return buildURI(cryptrBaseUrl, baseParams);
};

export const domainUrl = (
  config: PreparedCryptrConfig,
  transaction: Transaction,
  domain: string
) => {
  return signInUrl(config, transaction, 'domain', domain);
};

export const emailUrl = (
  config: PreparedCryptrConfig,
  transaction: Transaction,
  email: string
) => {
  return signInUrl(config, transaction, 'email', email);
};

const buildURI = (
  hostname: string,
  queryParamsObject: URLSearchParams
): string => {
  const url = new URL(hostname);
  // url.search = queryParamsObject.toString();
  return url.toString() + '?' + queryParamsObject.toString();
};

export const universalTokenUrl = (
  config: PreparedCryptrConfig,
  orgDomain: string
): string => {
  let urlParts = [config.cryptrServiceUrl, 'org', orgDomain, 'oauth2', 'token'];
  return urlBuilder(urlParts);
};

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

export const universalTokensBody = (
  transaction: Transaction,
  params: any,
  config: PreparedCryptrConfig
) => {
  const {
    nonce,
    pkce: { codeVerifier, state },
  } = transaction;
  const { code, request_id } = params;
  const { clientId } = config;
  return JSON.stringify({
    grant_type: 'authorization_code',
    client_id: clientId,
    code: code,
    code_verifier: codeVerifier,
    nonce: nonce,
    request_id: request_id,
    client_state: state,
  });
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

export const extractParamsFromUri = (uri: string): IHash<any> => {
  let regex = /[?&]([^=#]+)=([^&#]*)/g;
  let params: IHash<any> = {};
  let match;
  while ((match = regex.exec(uri))) {
    let key = match[1];
    let val = match[2];
    if (key) {
      params[key] = val;
    }
  }
  return params;
};

export const logOutBody = (
  config: PreparedCryptrConfig,
  accessToken?: string,
  refreshToken?: string
): string | undefined => {
  const { clientId } = config;
  const token = refreshToken || accessToken;
  if (token) {
    let tokenTypeHint = refreshToken ? 'refresh_token' : 'access_token';
    return JSON.stringify({
      token: token,
      token_type_hint: tokenTypeHint,
      client_id: clientId,
    });
  }
  return undefined;
};

export const revokeTokenUrl = (config: PreparedCryptrConfig): string => {
  const { cryptrServiceUrl } = config;
  let urlParts = [cryptrServiceUrl, 'oauth', 'revoke'];
  return urlBuilder(urlParts);
};

export const refreshBody = (
  refreshToken: string,
  refreshTransaction: Transaction,
  config: PreparedCryptrConfig
) => {
  const { nonce } = refreshTransaction;
  return JSON.stringify({
    client_id: config.clientId,
    grant_type: 'refresh_token',
    nonce: nonce,
    token: refreshToken,
  });
};

export const refreshTokenUrl = (config: PreparedCryptrConfig): string => {
  const { cryptrServiceUrl } = config;
  let urlParts = [cryptrServiceUrl, 'oauth', 'token'];
  return urlBuilder(urlParts);
};
