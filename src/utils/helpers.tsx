import { NativeModules, Platform } from 'react-native';
import type Transaction from '../models/Transaction';
import { CRYPTR_BASE_URL_EU, CRYPTR_BASE_URL_US } from './constants';
import { Locale, Region } from './enums';
import type {
  IHash,
  JwtBodyObject,
  PreparedCryptrConfig,
  ProviderOptions,
} from './interfaces';

const finalCryptrBaseUrl = (options: ProviderOptions) => {
  if (options.cryptr_base_url) {
    return options.cryptr_base_url;
  } else if (options.region === Region.US) {
    return CRYPTR_BASE_URL_US;
  }
  return CRYPTR_BASE_URL_EU;
};

export const prepareConfig = (
  options: ProviderOptions
): PreparedCryptrConfig => {
  return {
    tenant_domain: options.tenant_domain,
    client_id: options.client_id,
    audience: options.audience,
    cryptr_base_url: finalCryptrBaseUrl(options),
    default_locale: options.default_locale || deviceCryptrLocale(),
    default_redirect_uri: options.default_redirect_uri,
    dedicated_server: options.dedicated_server || false,
    no_popup_no_cookie: options.no_popup_no_cookie || false,
  };
};

export const tokensBody = (
  transaction: Transaction,
  params: any,
  config: PreparedCryptrConfig
) => {
  const {
    nonce,
    pkce: { codeVerifier },
  } = transaction;
  return JSON.stringify({
    authorization_id: params.authorization_id,
    client_id: config.client_id,
    code: config.client_id,
    code_verifier: codeVerifier,
    grant_type: 'authorization_code',
    nonce: nonce,
  });
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
  const { client_id } = config;
  return JSON.stringify({
    grant_type: 'authorization_code',
    client_id: client_id,
    code: code,
    code_verifier: codeVerifier,
    nonce: nonce,
    request_id: request_id,
    client_state: state,
  });
};

export const logOutBody = (
  accessToken?: string,
  refreshToken?: string
): string | undefined => {
  const token = refreshToken || accessToken;
  if (token) {
    let tokenTypeHint = refreshToken ? 'refresh_token' : 'access_token';
    return JSON.stringify({
      token: token,
      token_type_hint: tokenTypeHint,
    });
  }
  return undefined;
};

export const refreshBody = (
  refreshToken: string,
  refreshTransaction: Transaction,
  config: PreparedCryptrConfig
) => {
  const { nonce } = refreshTransaction;
  return JSON.stringify({
    client_id: config.client_id,
    grant_type: 'refresh_token',
    nonce: nonce,
    refresh_token: refreshToken,
  });
};

export const extractParamsFromUri = (uri: string): IHash<any> => {
  let regex = /[?&]([^=#]+)=([^&#]*)/g;
  let params: IHash<any> = {};
  let match;
  while ((match = regex.exec(uri))) {
    let key = match[1];
    let val = match[2];
    params[key] = val;
  }
  return params;
};

const deviceLanguage = (): string => {
  try {
    return Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
      : NativeModules.I18nManager.localeIdentifier;
  } catch (_error) {
    return 'en_US';
  }
};

export const deviceCryptrLocale = (): Locale => {
  let lang = deviceLanguage().split('_')[0].split('-')[0].toUpperCase();
  let dLocale: Locale =
    (Locale[lang as keyof typeof Locale] as Locale) || Locale.EN;
  return dLocale;
};

export const organizationDomain = (
  refreshToken: string
): string | undefined => {
  if (refreshToken.includes('.')) {
    return refreshToken.split('.')[0];
  }
  return undefined;
};

export const canProcessSloCode = (
  access_token_fields: JwtBodyObject,
  slo_code?: string,
  platform = Platform.OS
): boolean => {
  let ips = access_token_fields.ips;
  return (
    slo_code !== undefined &&
    slo_code !== '' &&
    platform !== 'ios' &&
    ips !== 'incompatible_ips'
    // &&
    // ips !== 'google'
  );
};

export const checkEmailValue = (emailValue: string) => {
  if (emailValue.trim() === '') {
    throw new Error('Please provide non blank string for email');
  }
  if (
    !/^[a-z0-9]+[-_.]?[a-z0-9]+@(?:[a-zA-Z0-9-]+\.)+[A-Za-z]+$/.test(emailValue)
  ) {
    throw new Error('Please provide valid email');
  }
  return emailValue;
};

export const checkDomainValue = (domainValue?: string) => {
  if (domainValue === undefined || domainValue.trim() === '') {
    throw new Error('Please provide non blank string for domain');
  }
  if (!/^[a-z0-9-]*$/.test(domainValue)) {
    throw new Error(
      'Please provide valid domain (alphanumeric dashed separated)'
    );
  }
  return domainValue;
};
