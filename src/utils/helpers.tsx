import type { PreparedCryptrConfig, ProviderOptions } from './interfaces';

export const checkEmailValue = (emailValue: string) => {
  if (emailValue.trim() === '') {
    throw new Error('Please provide non blank string for email');
  }
  if (
    !/^[a-z0-9]+[-_.]?[a-z0-9]+@(?:[a-zA-Z0-9-]+\.)+[A-Za-z]+$/.test(emailValue)
  ) {
    throw new Error('Please provide valid email');
  }
  return emailValue;
};

export const checkDomainValue = (domainValue?: string) => {
  if (domainValue === undefined || domainValue.trim() === '') {
    throw new Error('Please provide non blank string for domain');
  }
  if (
    domainValue !== undefined &&
    (domainValue.trim() === '' || !/^[a-z0-9-]*$/.test(domainValue))
  ) {
    throw new Error(
      'Please provide valid domain (alphanumeric dashed separated)'
    );
  }
  return domainValue;
};

export const prepareConfig = (
  options: ProviderOptions
): PreparedCryptrConfig => {
  let expectedKeys = [
    'accountDomain',
    'clientId',
    'audience',
    'cryptrServiceUrl',
    'defaultLocale',
    'defaultRedirectUri',
  ];
  let givenKeys = Object.keys(options);
  let missingKeys = expectedKeys.filter((k) => !givenKeys.includes(k));
  if (missingKeys.length === 0) {
    return {
      accountDomain: options.accountDomain,
      clientId: options.clientId,
      audience: options.audience,
      cryptrServiceUrl: options.cryptrServiceUrl,
      defaultLocale: options.defaultLocale,
      defaultRedirectUri: options.defaultRedirectUri,
      dedicatedServer: options.dedicatedServer || false,
      noPopupNoCookie: options.noPopupNoCookie || false,
    };
  } else {
    throw new Error(`Missing keys: ${missingKeys}`);
  }
};
