import type { PreparedCryptrConfig } from '../../utils/interfaces';
import Jwt from '../../utils/jwt';
import { SUCCESSFULL_TOKEN_RESPONSE } from '../mocks/mockData';

const config: PreparedCryptrConfig = {
  cryptrServiceUrl: 'http://lvh.me:4000',
  dedicatedServer: true,
  accountDomain: 'communitiz-app',
  clientId: '3505775e-76d9-46ad-b172-b87c2f507231',
  noPopupNoCookie: false,
  audience: 'http://localhost:8000',
  defaultRedirectUri: 'http://localhost:8000',
};

describe('Jwt.validatesAccessToken/2', () => {
  test('should return success if right access token given', () => {
    expect(
      Jwt.validatesAccessToken(SUCCESSFULL_TOKEN_RESPONSE.access_token, config)
    ).toBeTruthy();
  });

  test('should fail if wrong service url', () => {
    expect(() =>
      Jwt.validatesAccessToken(SUCCESSFULL_TOKEN_RESPONSE.access_token, {
        ...config,
        cryptrServiceUrl: 'https://example.com',
      })
    ).toThrow(
      'Issuer (iss) http://lvh.me:4000/t/decathlon is not compliant with https://example.com/t/decathlon'
    );
  });

  test('should fail if wrong client id', () => {
    expect(() =>
      Jwt.validatesAccessToken(SUCCESSFULL_TOKEN_RESPONSE.access_token, {
        ...config,
        clientId: 'azerty',
      })
    ).toThrow(
      'Client id (client_id) 3505775e-76d9-46ad-b172-b87c2f507231 claim is not compliant with azerty from config'
    );
  });

  test('should fail if wrong audience', () => {
    expect(() =>
      Jwt.validatesAccessToken(SUCCESSFULL_TOKEN_RESPONSE.access_token, {
        ...config,
        audience: 'http://azerty.com',
      })
    ).toThrow(
      'Audience (aud) http://localhost:8000 claim is not compliant with http://azerty.com from config'
    );
  });
});

describe('Jwt.validatesIdToken/2', () => {
  test('should return success if right access token given', () => {
    expect(
      Jwt.validatesIdToken(SUCCESSFULL_TOKEN_RESPONSE.id_token, config)
    ).toBeTruthy();
  });

  test('should fail if wrong service url', () => {
    expect(() =>
      Jwt.validatesAccessToken(SUCCESSFULL_TOKEN_RESPONSE.id_token, {
        ...config,
        cryptrServiceUrl: 'https://example.com',
      })
    ).toThrow(
      'Issuer (iss) http://lvh.me:4000/t/decathlon is not compliant with https://example.com/t/decathlon'
    );
  });

  test('should fail if wrong couple client_id/aud', () => {
    expect(() =>
      Jwt.validatesAccessToken(SUCCESSFULL_TOKEN_RESPONSE.id_token, {
        ...config,
        clientId: 'azerty',
      })
    ).toThrow(
      'Audience (aud) 3505775e-76d9-46ad-b172-b87c2f507231 claim is not compliant with azerty from config'
    );
  });
});
