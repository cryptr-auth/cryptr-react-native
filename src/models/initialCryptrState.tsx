import type { CryptrState } from '../utils/interfaces';

const initialCryptrState: CryptrState = {
  isLoading: false,
  isAuthenticated: false,
  accessToken: undefined,
  idToken: undefined,
};

export default initialCryptrState;
