import initialCryptrState from '../../models/initialCryptrState';

describe('initialCryptrState', () => {
  it('should start with proper init state', () => {
    expect(initialCryptrState).toEqual({
      isLoading: false,
      isAuthenticated: false,
      accessToken: undefined,
      idToken: undefined,
    });
  });
});
