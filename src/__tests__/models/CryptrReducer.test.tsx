import { CryptrReducerActionKind } from '../../utils/enums';
import type { CryptrState } from '../../utils/interfaces';
import CryptrReducer from '../../models/CryptrReducer';
import initialCryptrState from '../../models/initialCryptrState';

describe('CryptrReducer/2', () => {
  it('should return loading state if "LOADING" action', () => {
    const origState: CryptrState = initialCryptrState;
    expect(
      CryptrReducer(origState, { type: CryptrReducerActionKind.LOADING })
    ).toEqual({
      accessToken: undefined,
      error: undefined,
      error_description: undefined,
      isLoading: true,
      idToken: undefined,
      isAuthenticated: false,
    });
  });

  it('should return false loading state if "UNLOADING" action', () => {
    const origState: CryptrState = initialCryptrState;
    expect(
      CryptrReducer(origState, { type: CryptrReducerActionKind.UNLOADING })
    ).toEqual({
      accessToken: undefined,
      error: undefined,
      error_description: undefined,
      isLoading: false,
      idToken: undefined,
      isAuthenticated: false,
    });
  });

  it('should return access & id tokens + is authenticated true if "AUTHENTICATED" action + Payload', () => {
    const origState: CryptrState = initialCryptrState;
    expect(
      CryptrReducer(origState, {
        type: CryptrReducerActionKind.AUTHENTICATED,
        payload: { access_token: 'access_token', id_token: 'id_token' },
      })
    ).toEqual({
      accessToken: 'access_token',
      error: undefined,
      error_description: undefined,
      isLoading: false,
      idToken: 'id_token',
      isAuthenticated: true,
    });
  });

  it('should return is authenticated true if "AUTHENTICATED" action without Payload', () => {
    const origState: CryptrState = initialCryptrState;
    expect(
      CryptrReducer(origState, { type: CryptrReducerActionKind.AUTHENTICATED })
    ).toEqual({
      accessToken: undefined,
      error: undefined,
      error_description: undefined,
      isLoading: false,
      idToken: undefined,
      isAuthenticated: true,
    });
  });

  it('should return is authenticated fals if "UNAUTHENTICATED" action with/out Payload', () => {
    const origState: CryptrState = initialCryptrState;
    expect(
      CryptrReducer(origState, {
        type: CryptrReducerActionKind.UNAUTHENTICATED,
        payload: { error: 'There was an error' },
      })
    ).toEqual({
      accessToken: undefined,
      error: 'There was an error',
      error_description: undefined,
      isLoading: false,
      idToken: undefined,
      isAuthenticated: false,
    });
  });

  it('should return is authenticated fals if "ERROR" action with/out Payload', () => {
    const origState: CryptrState = initialCryptrState;
    expect(
      CryptrReducer(origState, {
        type: CryptrReducerActionKind.ERROR,
        error: { message: 'There was an error' },
      })
    ).toEqual({
      accessToken: undefined,
      error: 'There was an error',
      error_description: 'There was an error',
      isLoading: false,
      idToken: undefined,
      isAuthenticated: false,
    });
  });
});
