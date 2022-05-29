import { Locale, Sign } from '../../utils/enums';
import Transaction from '../../models/Transaction';

describe('Transaction', () => {
  const REDIRECT_URI = 'cryptr://auth-app';

  it('creates a default Transaction with only redirection', () => {
    const transaction = new Transaction(REDIRECT_URI);
    expect(transaction.redirectUri).toEqual('cryptr://auth-app');
    expect(transaction.signType).toEqual('signin');
    expect(transaction.scope).toEqual('openid email profile');
    expect(transaction.locale).toEqual('en');
    expect(typeof transaction.nonce).toBe('string');
    expect(typeof transaction.pkce).toBe('object');
    expect(transaction.pkce.codeChallenge).not.toBeUndefined();
  });

  it('creates a Refresh Transaction with redirection and type', () => {
    const transaction = new Transaction(REDIRECT_URI, Sign.REFRESH);
    expect(transaction.redirectUri).toEqual('cryptr://auth-app');
    expect(transaction.signType).toEqual('refresh');
    expect(transaction.scope).toEqual('openid email profile');
    expect(transaction.locale).toEqual('en');
    expect(typeof transaction.nonce).toBe('string');
    expect(typeof transaction.pkce).toBe('object');
    expect(transaction.pkce.codeChallenge).not.toBeUndefined();
  });

  it('creates a scoped Refresh Transaction with redirection, type and locale', () => {
    const transaction = new Transaction(
      REDIRECT_URI,
      Sign.REFRESH,
      'openid email profile billings'
    );
    expect(transaction.redirectUri).toEqual('cryptr://auth-app');
    expect(transaction.signType).toEqual('refresh');
    expect(transaction.scope).toEqual('openid email profile billings');
    expect(transaction.locale).toEqual('en');
    expect(typeof transaction.nonce).toBe('string');
    expect(typeof transaction.pkce).toBe('object');
    expect(transaction.pkce.codeChallenge).not.toBeUndefined();
  });

  it('creates a French Refresh Transaction with redirection, type and locale', () => {
    const transaction = new Transaction(
      REDIRECT_URI,
      Sign.REFRESH,
      'openid email profile billings',
      Locale.FR
    );
    expect(transaction.redirectUri).toEqual('cryptr://auth-app');
    expect(transaction.signType).toEqual('refresh');
    expect(transaction.scope).toEqual('openid email profile billings');
    expect(transaction.locale).toEqual('fr');
    expect(typeof transaction.nonce).toBe('string');
    expect(typeof transaction.pkce).toBe('object');
    expect(transaction.pkce.codeChallenge).not.toBeUndefined();
  });
});
