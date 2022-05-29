import {
  CRYPTR_BASE_URL_EU,
  CRYPTR_BASE_URL_US,
  DEFAULT_SCOPE,
} from '../../utils/constants';

describe('constants', () => {
  it('should return proper default scope', () => {
    expect(DEFAULT_SCOPE).toEqual('openid email profile');
  });

  it('should return proper default EU base url', () => {
    expect(CRYPTR_BASE_URL_EU).toEqual('https://auth.cryptr.eu');
  });

  it('should return proper default US base url', () => {
    expect(CRYPTR_BASE_URL_US).toEqual('https://auth.cryptr.us');
  });
});
