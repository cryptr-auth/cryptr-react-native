import React, { useEffect, useReducer, useState } from 'react';
import CryptrContext from './CryptrContext';
import CryptrReducer from './CryptrReducer';
import initialCryptrState from './initialCryptrState';
import Transaction from './Transaction';
import {
  decoratedRequestInit,
  jsonApiRequest,
  refreshTokenUrl,
  revokeTokenUrl,
  sloAfterRevokeTokenUrl,
  tokenUrl,
  universalTokenUrl,
  domainGatewayUrl,
  emailGatewayUrl,
} from '../utils/apiHelpers';
import { CryptrReducerActionKind, Sign } from '../utils/enums';
import type {
  CryptrActionError,
  CryptrUser,
  PreparedCryptrConfig,
  ProviderProps,
  SecuredNavigationEvent,
} from '../utils/interfaces';
import Cryptr from './Cryptr';
import {
  canProcessSloCode,
  extractParamsFromUri,
  logOutBody,
  organizationDomain,
  prepareConfig,
  refreshBody,
  tokensBody,
  universalTokensBody,
} from '../utils/helpers';
import { DeviceEventEmitter } from 'react-native';
import Jwt from '../utils/jwt';

const CryptrProvider: React.FC<ProviderProps> = ({
  children,
  ...options
}): JSX.Element => {
  const [config] = useState<PreparedCryptrConfig>(prepareConfig(options));
  const [state, dispatch] = useReducer(CryptrReducer, initialCryptrState);

  // Quick state helpers
  const setLoading = () => dispatch({ type: CryptrReducerActionKind.LOADING });

  const setUnloading = () =>
    dispatch({ type: CryptrReducerActionKind.UNLOADING });

  const setUnAuthenticated = () =>
    dispatch({ type: CryptrReducerActionKind.UNAUTHENTICATED });

  const setError = (error: any) => {
    const errorToSend = error.message ? error : { message: error };
    dispatch({
      type: CryptrReducerActionKind.ERROR,
      error: errorToSend as CryptrActionError,
    });
  };

  const setStateWithPayload = (type: CryptrReducerActionKind, payload: any) => {
    dispatch({
      type: type,
      payload: payload,
    });
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
            if (error) {
              dispatch({ type: CryptrReducerActionKind.UNAUTHENTICATED });
            }
          });
        } catch (_e) {}
      }
    };
    configFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const handleNewTokens = (json: any, callback?: (data: any) => any) => {
    if (json.refresh_token) {
      const organization_domain = organizationDomain(json.refresh_token);
      Jwt.validatesAccessToken(json.access_token, config, organization_domain);
      Jwt.validatesIdToken(json.id_token, config, organization_domain);
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
    if (callback !== undefined) {
      callback(json);
    }
  };

  const getTokens = (
    params: any,
    transaction: Transaction,
    callback?: (data: any) => any
  ) => {
    let body = tokensBody(transaction, params, config);
    const tokenURL = tokenUrl(config, params, transaction);
    jsonApiRequest(tokenURL, body)
      .then((resp) => resp.json())
      .then((json) => {
        handleNewTokens(json, callback);
      })
      .catch((error) => {
        setError(error);
      });
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
      .then((json) => {
        handleNewTokens(json, callback);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleRedirectCalback = (
    transaction: Transaction,
    callback?: (redirectUri: any) => any
  ) => {
    return (incomeUri: string) => {
      try {
        let params = extractParamsFromUri(incomeUri);
        if (params.request_id) {
          getUniversalTokens(params, transaction, callback);
        } else {
          getTokens(params, transaction, callback);
        }
      } catch (error) {
        setError(error);
      }
    };
  };

  const signInWithDomain = (
    domain?: string,
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => {
    let transaction = new Transaction(config.default_redirect_uri, Sign.SSO);
    let uri = domainGatewayUrl(config, transaction, domain);
    setLoading();
    Cryptr.startSecuredView(
      uri,
      config.no_popup_no_cookie,
      handleRedirectCalback(transaction, successCallback),
      (error: any) => {
        setError(error);
        errorCallback && errorCallback(error);
      }
    );
  };

  const signInWithEmail = (
    email: string,
    successCallback?: (data: any) => any,
    errorCallback?: (data: any) => any
  ) => {
    let transaction = new Transaction(config.default_redirect_uri, Sign.SSO);
    let uri = emailGatewayUrl(config, transaction, email);
    setLoading();
    Cryptr.startSecuredView(
      uri,
      config.no_popup_no_cookie,
      handleRedirectCalback(transaction, successCallback),
      (error: any) => {
        setError(error);
        errorCallback && errorCallback(error);
      }
    );
  };

  const handleLogOut = (
    json: any,
    callback?: (data: any) => any,
    errorCallback?: (error: any) => any
  ) => {
    const { access_token, revoked_at, slo_code } = json;
    if (revoked_at) {
      setUnAuthenticated();
      Cryptr.removeRefresh(
        (_data: any) => {
          if (canProcessSloCode(Jwt.body(access_token), slo_code)) {
            let sloUrl = sloAfterRevokeTokenUrl(config, slo_code);
            Cryptr.startSecuredView(
              sloUrl,
              config.no_popup_no_cookie,
              (_d: any) => {
                callback && callback(json);
              },
              (error: any) => {
                setError(error);
                errorCallback && errorCallback(error);
              }
            );
          } else {
            if (callback) callback(json);
          }
        },
        (error: any) => {
          errorCallback && errorCallback(error);
        }
      );
    } else {
      setUnloading();
      if (errorCallback) errorCallback(json);
    }
  };

  const logOut = async (
    successCallback?: (data: any) => any,
    errorCallback?: (error: any) => any
  ) => {
    const { accessToken } = state;
    Cryptr.getRefresh(
      (refreshToken: any) => {
        const body = logOutBody(accessToken, refreshToken);
        if (body) {
          setLoading();

          jsonApiRequest(revokeTokenUrl(config, refreshToken), body)
            .then((resp) => resp.json())
            .then((json) => {
              handleLogOut(json, successCallback);
            })
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
      dispatch({
        type: CryptrReducerActionKind.UNAUTHENTICATED,
        payload: json,
      });
      errorCallback && errorCallback(json);
    } else {
      if (json.refresh_token) {
        const organization_domain = organizationDomain(json.refresh_token);
        Jwt.validatesAccessToken(
          json.access_token,
          config,
          organization_domain
        );
        Jwt.validatesIdToken(json.id_token, config, organization_domain);
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
      (refreshvalue: any) => {
        if (refreshvalue) {
          setLoading();
          getTokensByRefresh(refreshvalue)
            .then((resp) => resp.json())
            .then((json) => {
              handleRefreshResponse(json, successCallback, errorCallback);
            })
            .catch((error) => {
              setError(error);
              errorCallback && errorCallback(error);
            });
        } else {
          console.warn('no refresh found');
        }
      },
      (error: any) => {
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
      config.default_redirect_uri,
      Sign.REFRESH
    );
    let body = refreshBody(refreshToken, refreshTransaction, config);
    return jsonApiRequest(
      refreshTokenUrl(config, refreshTransaction, refreshToken),
      body
    );
  };

  const getUser = (): CryptrUser | undefined => {
    if (state.idToken) {
      return Jwt.body(state.idToken) as CryptrUser;
    }
    return undefined;
  };

  const decoratedRequest = (
    input: RequestInfo,
    init?: RequestInit
  ): Promise<Response> => {
    const { accessToken } = state;
    return fetch(input, decoratedRequestInit(accessToken, init));
  };

  return (
    <CryptrContext.Provider
      data-testid="CryptrProvider"
      value={{
        ...state,
        config: () => config,
        logOut: (
          successCallback?: (data: any) => any,
          errorCallback?: (error: any) => any
        ) => logOut(successCallback, errorCallback),
        refreshTokens: (callback?: (data: any) => any) =>
          refreshTokens(callback),
        user: () => getUser(),
        decoratedRequest: (input: RequestInfo, init?: RequestInit) =>
          decoratedRequest(input, init),
        signInWithDomain: (
          domain?: string,
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
