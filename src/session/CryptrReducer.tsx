import { CryptrReducerActionKind } from '../utils/enums';
import type { CryptrAction, CryptrState } from '../utils/interfaces';
import Jwt from '../utils/jwt';
import type { CryptrUser } from '../utils/types';

const CryptrReducer = (state: CryptrState, action: CryptrAction) => {
  switch (action.type) {
    case CryptrReducerActionKind.LOADING:
      return {
        ...state,
        isLoading: true,
        error: undefined,
        error_description: undefined,
      };
    case CryptrReducerActionKind.UNLOADING:
      return {
        ...state,
        isLoading: false,
        error: undefined,
        error_description: undefined,
      };
    case CryptrReducerActionKind.AUTHENTICATED:
      let accessToken = action.payload && action.payload.access_token;
      let idToken = action.payload && action.payload.id_token;
      let userVal = idToken ? (Jwt.body(idToken) as CryptrUser) : undefined;
      return {
        ...state,
        isAuthenticated: true,
        accessToken: accessToken,
        idToken: idToken,
        user: userVal,
        isLoading: false,
      };
    case CryptrReducerActionKind.UNAUTHENTICATED:
      return {
        ...state,
        isAuthenticated: false,
        error: action.payload && action.payload.error,
        error_description: action.payload && action.payload.error_description,
        accessToken: undefined,
        idToken: undefined,
        user: undefined,
        isLoading: false,
      };
    case CryptrReducerActionKind.ERROR:
      return {
        ...state,
        error: action.error && action.error.message,
        error_description: action.error && action.error.message,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default CryptrReducer;
