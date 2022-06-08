import { createContext } from 'react';
import initialCryptrState from './initialCryptrState';
import type { CryptrConfig } from '../utils/interfaces';

const error = (...args: any) => {
  console.debug(args);
  throw new Error('You have to wrap your component in CryptrProvider');
};

const initialContext = {
  ...initialCryptrState,
  config: error as unknown as () => CryptrConfig,
  signinWithSSO: error as unknown as (
    idpId: string,
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => void,
  signinWithSSOGateway: error as unknown as (
    idpId?: string | string[],
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => void,
  logOut: error as unknown as (
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => Promise<void>,
  refreshTokens: error as unknown as (
    successCallback?: (data: any) => any,
    errorCallback?: (error: any) => any
  ) => void,
  user: error as unknown as () => Object | undefined,
  decoratedRequest: error as unknown as (
    input: RequestInfo,
    init?: RequestInit
  ) => Promise<Response>,
};

const CryptrContext = createContext(initialContext);

export default CryptrContext;
