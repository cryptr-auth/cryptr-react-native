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
  signIn: error as unknown as (
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => void,
  signInWithDomain: error as unknown as (
    domain: string,
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => void,
  signInWithEmail: error as unknown as (
    email: string,
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => void,
  logOut: error as unknown as (
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => Promise<void>,
  refreshTokens: error as unknown as (
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => void,
};

const CryptrContext = createContext(initialContext);

export default CryptrContext;
