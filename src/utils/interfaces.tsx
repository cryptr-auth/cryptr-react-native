import type { ReactNode } from 'react';
import type { CryptrReducerActionKind } from './enums';
import type { CryptrUser } from './types';

export interface CryptrConfig {
  accountDomain: string;
  clientId: string;
  audience: string;
  defaultRedirectUri: string;
  defaultLocale?: string;
  cryptrServiceUrl: string;
  telemetry?: boolean;
  dedicatedServer?: boolean;
  noPopupNoCookie?: boolean;
}

export default interface CryptrInterface {
  startAuthentication: (
    uri: string,
    no_popup_no_cookie: boolean,
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => any;
  getRefresh: (
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => any;
  removeRefresh: (
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => any;
  setRefresh: (
    refreshToken: string,
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => any;
}

export interface ProviderOptions extends CryptrConfig {}

export interface ProviderProps extends ProviderOptions {
  children: ReactNode;
}

export interface CryptrState {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken?: string;
  idToken?: string;
  user?: CryptrUser;
  error?: any;
  error_description?: string;
}

export interface CryptrActionPayload {
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

export interface PreparedCryptrConfig extends CryptrConfig {
  cryptrServiceUrl: string;
  dedicatedServer: boolean;
  noPopupNoCookie: boolean;
}

export interface IHash<T> {
  [index: string]: T;
}

export interface SecuredNavigationEvent {
  eventType: string;
}
