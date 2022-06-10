import type { ReactNode } from 'react';
import type { CryptrReducerActionKind } from './enums';

interface CryptrActionPayload {
  access_token?: string;
  id_token?: string;
  error?: string;
  error_description?: string;
}

export interface CryptrActionError {
  message?: string;
}

export interface CryptrAction {
  type: CryptrReducerActionKind;
  payload?: CryptrActionPayload;
  error?: CryptrActionError;
}

export interface CryptrState {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken?: string;
  idToken?: string;
  error?: string;
  error_description?: string;
}

export interface CryptrConfig {
  tenant_domain: string;
  client_id: string;
  audience: string;
  default_redirect_uri: string;
  default_locale?: string;
  region?: string;
  cryptr_base_url?: string;
  telemetry?: boolean;
  dedicated_server?: boolean;
}

export interface PreparedCryptrConfig extends CryptrConfig {
  cryptr_base_url: string;
  dedicated_server: boolean;
}

export interface ProviderOptions extends CryptrConfig {}

export interface ProviderProps extends ProviderOptions {
  children: ReactNode;
}

export interface IHash<T> {
  [index: string]: T;
}

export interface SecuredNavigationEvent {
  eventType: string;
}

type MetadataType = {
  [key: string]: any;
};

export type JwtHeaderType = {
  alg: string;
  typ: string;
  [key: string]: any;
};

export type CryptrUser = {
  application_metadata?: MetadataType;
  at_hash?: string;
  aud?: string;
  c_hash?: string;
  cid?: string;
  dbs?: string;
  email: string;
  exp: number;
  family_name?: string;
  given_name?: string;
  iat: number;
  iss: string;
  jti?: string;
  jtt: string;
  nonce: string;
  resource_owner_metadata?: MetadataType;
  s_hash?: string;
  scp?: string[];
  sub: string;
  tnt: string;
  ver: number;
};
