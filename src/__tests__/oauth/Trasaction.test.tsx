import Transaction from '../../oauth/Transaction';
import { Locale } from '../../utils/enums';

describe('Transaction/2', () => {
  test('should return proper Trasaction', () => {
    const transaction = new Transaction(Locale.EN, 'cryptr://auth-app');
    expect(transaction.locale).toEqual('en');
    expect(transaction.redirectUri).toEqual('cryptr://auth-app');
    expect(transaction.scope).toEqual('openid email profile');
    expect(transaction.pkce).not.toBeNull();
    expect(transaction.nonce).not.toBeNull();
  });
});

describe('Transaction/3', () => {
  test('should return proper Trasaction', () => {
    const transaction = new Transaction(
      Locale.EN,
      'cryptr://auth-app',
      'openid email profile admin'
    );
    expect(transaction.locale).toEqual('en');
    expect(transaction.redirectUri).toEqual('cryptr://auth-app');
    expect(transaction.scope).toEqual('openid email profile admin');
    expect(transaction.pkce).not.toBeNull();
    expect(transaction.nonce).not.toBeNull();
  });
});
