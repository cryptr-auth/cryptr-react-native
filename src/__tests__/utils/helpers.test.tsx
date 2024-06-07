import { Locale } from '../../utils/enums';
import {
  checkDomainValue,
  checkEmailValue,
  prepareConfig,
} from '../../utils/helpers';
import type { ProviderOptions } from '../../utils/interfaces';

describe('helpers#checkEmailValue', () => {
  test('should succeed if proper email', () => {
    expect(checkEmailValue('me@example.com')).toEqual('me@example.com');
  });

  test('should fail with non blank string error when empty of whitespaces', () => {
    expect(() => checkEmailValue('')).toThrow(
      'Please provide non blank string for email'
    );
    expect(() => checkEmailValue('  ')).toThrow(
      'Please provide non blank string for email'
    );
  });

  test('should fail if wrong email given', () => {
    expect(() => checkEmailValue('me@example')).toThrow('Please provide valid');
    expect(() => checkEmailValue('Company name')).toThrow(
      'Please provide valid'
    );
  });
});

describe('helpers#checkDomainValue', () => {
  test('should succeed if proper email', () => {
    expect(checkDomainValue('account-domain')).toEqual('account-domain');
  });

  test('should fail with non blank string error when empty of whitespaces', () => {
    expect(() => checkDomainValue('')).toThrow(
      'Please provide non blank string for domain'
    );
    expect(() => checkDomainValue('  ')).toThrow(
      'Please provide non blank string for domain'
    );
  });

  test('should fail if wrong email given', () => {
    expect(() => checkDomainValue('me@example')).toThrow(
      'Please provide valid'
    );
    expect(() => checkDomainValue('account_domain')).toThrow(
      'Please provide valid'
    );
    expect(() => checkDomainValue('Company name')).toThrow(
      'Please provide valid'
    );
  });
});

describe('helpers#prepareConfig/1', () => {
  test('should return proper config if all provided', () => {
    let config: ProviderOptions = {
      accountDomain: 'communitiz-app',
      cryptrServiceUrl: 'https://cryptr.authent.me',
      dedicatedServer: true,
      clientId: '0e0abbad-b214-47ed-9570-dc531ea21422',
      noPopupNoCookie: false,
      audience: 'cryptr://mobile-app',
      defaultRedirectUri: 'cryptr://mobile-app',
      defaultLocale: Locale.EN,
    };
    expect(prepareConfig(config)).toEqual(config);
  });

  test('should return proper config if no optional provided', () => {
    let config: ProviderOptions = {
      accountDomain: 'communitiz-app',
      cryptrServiceUrl: 'https://cryptr.authent.me',
      clientId: '0e0abbad-b214-47ed-9570-dc531ea21422',
      audience: 'cryptr://mobile-app',
      defaultRedirectUri: 'cryptr://mobile-app',
      defaultLocale: Locale.EN,
    };
    expect(prepareConfig(config)).toEqual({
      ...config,
      dedicatedServer: false,
      noPopupNoCookie: false,
    });
  });

  test('should fail if empty config provided', () => {
    let config = {} as ProviderOptions;
    expect(() => prepareConfig(config)).toThrow(
      'Missing keys: accountDomain,clientId,audience,cryptrServiceUrl,defaultLocale,defaultRedirectUri'
    );
  });
});
