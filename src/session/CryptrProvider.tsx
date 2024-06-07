import React, { useEffect, useReducer, useState } from 'react';
import type {
  CryptrActionError,
  CryptrActionPayload,
  PreparedCryptrConfig,
  ProviderProps,
  SecuredNavigationEvent,
} from '../utils/interfaces';
import CryptrContext from './CryptrContext';
import CryptrReducer from './CryptrReducer';
import initialCryptrState from './initialCryptrState';
import { prepareConfig } from '../utils/helpers';
import Transaction from '../oauth/Transaction';
import { CryptrReducerActionKind, Locale } from '../utils/enums';
import {
  domainUrl,
  emailUrl,
  extractParamsFromUri,
  jsonApiRequest,
  logOutBody,
  refreshBody,
  refreshTokenUrl,
  revokeTokenUrl,
  signInUrl,
  universalTokensBody,
  universalTokenUrl,
} from '../utils/apiHelpers';
import Jwt from '../utils/jwt';
import Cryptr from '../Cryptr';
import { DeviceEventEmitter } from 'react-native';
import type { CryptrUser } from '../utils/types';

const CryptrProvider: React.FC<ProviderProps> = ({
  children,
  ...options
}): JSX.Element => {
  const [config] = useState<PreparedCryptrConfig>(prepareConfig(options));
  const [state, dispatch] = useReducer(CryptrReducer, initialCryptrState);

  const setLoading = () => dispatch({ type: CryptrReducerActionKind.LOADING });

  const setUnloading = () =>
    dispatch({ type: CryptrReducerActionKind.UNLOADING });

  const setUnAuthenticated = (payload?: CryptrActionPayload) =>
    dispatch({
      type: CryptrReducerActionKind.UNAUTHENTICATED,
      payload: payload,
    });

  const setError = (error: any) => {
    const errorToSend = error.message ? error : { message: error };
    console.error(error);
    dispatch({
      type: CryptrReducerActionKind.ERROR,
      error: errorToSend as CryptrActionError,
    });
  };

  const setStateWithPayload = (type: CryptrReducerActionKind, payload: any) => {
    dispatch({ type: type, payload: payload });
  };

  const setAuthenticated = (payload: any) => {
    setStateWithPayload(CryptrReducerActionKind.AUTHENTICATED, payload);
  };

  const handleSecuredViewEvent = (event: SecuredNavigationEvent) => {
    const { eventType } = event;
    eventType === 'Tab Hidden' || eventType === 'Navigation Aborted'
      ? setUnloading()
      : setLoading();
  };

  useEffect(() => {
    const configFn = () => {
      if (config) {
        try {
          DeviceEventEmitter.addListener('onNavigationEvent', (event) => {
            handleSecuredViewEvent(event);
          });
          refreshTokens((data: any) => {
            const { error } = data;
            error && setError(error);
          });
        } catch (e) {
          e && setError(e);
        }
      }
    };
    configFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const handleNewTokens = (json: any, callback?: (data: any) => any) => {
    if (json.refresh_token) {
      Jwt.validatesAccessToken(json.access_token, config);
      Jwt.validatesIdToken(json.id_token, config);
      Cryptr.setRefresh(
        json.refresh_token,
        (_data: any) => {},
        (error: any) => {
          try {
            setError(error);
          } catch (_error) {}
        }
      );
    }

    const actionType = json.access_token
      ? CryptrReducerActionKind.AUTHENTICATED
      : CryptrReducerActionKind.UNAUTHENTICATED;
    setStateWithPayload(actionType, json);
    callback && callback(json);
  };

  const getUniversalTokens = (
    params: any,
    transaction: Transaction,
    callback?: (data: any) => any
  ) => {
    let body = universalTokensBody(transaction, params, config);
    const tokenURL = universalTokenUrl(config, params.organization_domain);
    jsonApiRequest(tokenURL, body)
      .then((resp) => resp.json())
      .then((json) => handleNewTokens(json, callback))
      .catch((error) => setError(error));
  };

  const handleRedirectCallback = (
    transaction: Transaction,
    callback?: (redirectUri: any) => any
  ) => {
    return (incomeUri: string) => {
      try {
        let params = extractParamsFromUri(incomeUri);
        getUniversalTokens(params, transaction, callback);
      } catch (error) {
        setError(error);
      }
    };
  };

  const signIn = async (
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => {
    let transaction = new Transaction(Locale.EN, config.defaultRedirectUri);
    let uri = signInUrl(config, transaction);
    setLoading();

    Cryptr.startAuthentication(
      uri,
      config.noPopupNoCookie,
      handleRedirectCallback(transaction, successCallback),
      (error: any) => {
        setError(error);
        errorCallback && errorCallback(error);
      }
    );
  };

  const signInWithDomain = async (
    domain: string,
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => {
    let transaction = new Transaction(Locale.EN, config.defaultRedirectUri);
    let uri = domainUrl(config, transaction, domain);
    setLoading();

    Cryptr.startAuthentication(
      uri,
      config.noPopupNoCookie,
      handleRedirectCallback(transaction, successCallback),
      (error: any) => {
        setError(error);
        errorCallback && errorCallback(error);
      }
    );
  };

  const signInWithEmail = async (
    email: string,
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => {
    let transaction = new Transaction(Locale.EN, config.defaultRedirectUri);
    let uri = emailUrl(config, transaction, email);
    setLoading();

    Cryptr.startAuthentication(
      uri,
      config.noPopupNoCookie,
      handleRedirectCallback(transaction, successCallback),
      (error: any) => {
        setError(error);
        errorCallback && errorCallback(error);
      }
    );
  };

  const handleLogOut = (
    resp: any,
    successCallback?: (data: any) => any,
    errorCallback?: (error: any) => any
  ) => {
    const { ok, status } = resp;
    if (ok && status === 200) {
      setUnAuthenticated();
      Cryptr.removeRefresh(
        (_data: any) => {
          successCallback && successCallback(resp);
        },
        (error: any) => {
          errorCallback && errorCallback(error);
        }
      );
    } else {
      setUnloading();
      errorCallback && errorCallback(resp);
    }
  };

  const logOut = async (
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => {
    const { accessToken } = state;
    Cryptr.getRefresh(
      (refreshToken: any) => {
        const body = logOutBody(config, accessToken, refreshToken);
        if (body) {
          setLoading();
          jsonApiRequest(revokeTokenUrl(config), body)
            .then((resp) => handleLogOut(resp, successCallback))
            .catch((error) => {
              setError(error);
              errorCallback && errorCallback(error);
            });
        }
      },
      (error: any) => {
        setError(error);
        errorCallback && errorCallback(error);
      }
    );
  };

  const handleRefreshResponse = (
    json: any,
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => {
    if (json.error) {
      setUnAuthenticated(json.error);
      setError(json.error);
      errorCallback && errorCallback(json);
    } else if (json.errors) {
      const error = Object.entries(json.errors)
        .map(([key, value]) => `${key} ${value}`)
        .join('\n');
      setUnAuthenticated({ error: error });
      setError(error);
      errorCallback && errorCallback(json);
    } else {
      if (json.refresh_token) {
        Jwt.validatesAccessToken(json.access_token, config);
        Cryptr.setRefresh(
          json.refresh_token,
          (_data: any) => {},
          (error: any) => {
            setError(error);
          }
        );
      }
      if (json.access_token) {
        setAuthenticated(json);
      }
      setUnloading();
      successCallback && successCallback(json);
    }
  };

  const refreshTokens = (
    successCallback?: (data: any) => any,
    errorCallback?: (error: any) => any
  ) => {
    Cryptr.getRefresh(
      (refreshValue: any) => {
        if (refreshValue) {
          setLoading();
          getTokensByRefresh(refreshValue)
            .then((resp) => resp.json())
            .then((json) => {
              handleRefreshResponse(json, successCallback, errorCallback);
            })
            .catch((error) => {
              console.error('gettokensbyrefresh');
              console.error(error);
              setError(error);
              errorCallback && errorCallback(error);
            });
        } else {
          console.warn('no refreh found');
        }
      },
      (error: any) => {
        console.error('refreshValue', error);
        dispatch({
          type: CryptrReducerActionKind.UNAUTHENTICATED,
          payload: { error: error },
        });
        errorCallback && errorCallback(error);
      }
    );
  };

  const getTokensByRefresh = (refreshToken: string): Promise<Response> => {
    let refreshTransaction = new Transaction(
      Locale.EN,
      config.defaultRedirectUri
    );
    let body = refreshBody(refreshToken, refreshTransaction, config);
    return jsonApiRequest(refreshTokenUrl(config), body);
  };

  const getUser = (): CryptrUser | undefined => {
    return state.idToken ? (Jwt.body(state.idToken) as CryptrUser) : undefined;
  };

  return (
    <CryptrContext.Provider
      data-testid="CryptrProvider"
      value={{
        ...state,
        config: () => config,
        user: () => getUser(),
        logOut: (
          successCallback?: (data: any) => any,
          errorCallback?: (data: any) => any
        ) => logOut(successCallback, errorCallback),
        refreshTokens: (
          successCallback?: (data: any) => any,
          errorCallback?: (data: any) => any
        ) => refreshTokens(successCallback, errorCallback),
        signIn: (
          successCallback?: (data: any) => any,
          errorCallback?: (data: any) => any
        ) => signIn(successCallback, errorCallback),
        signInWithDomain: (
          domain: string,
          successCallback?: (data: any) => any,
          errorCallback?: (data: any) => any
        ) => signInWithDomain(domain, successCallback, errorCallback),
        signInWithEmail: (
          email: string,
          successCallback?: (data: any) => any,
          errorCallback?: (data: any) => any
        ) => signInWithEmail(email, successCallback, errorCallback),
      }}
    >
      {children}
    </CryptrContext.Provider>
  );
};

export default CryptrProvider;
