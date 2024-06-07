import Transaction from '../oauth/Transaction';
import {
  jsonApiRequest,
  universalTokenUrl,
  universalTokensBody,
} from '../utils/apiHelpers';
import { Locale } from '../utils/enums';
import type { PreparedCryptrConfig } from '../utils/interfaces';
import { SUCCESSFULL_TOKEN_RESPONSE } from './mocks/mockData';

global.fetch = require('jest-fetch-mock');

const mockSuccessResponse = {
  status: 201,
  body: JSON.stringify(SUCCESSFULL_TOKEN_RESPONSE),
};

beforeEach(() => {
  fetch.resetMocks();
});

const config: PreparedCryptrConfig = {
  cryptrServiceUrl: 'https://cryptr.authent.me',
  dedicatedServer: true,
  accountDomain: 'communitiz-app',
  clientId: '0e0abbad-b214-47ed-9570-dc531ea21422',
  noPopupNoCookie: false,
  audience: 'cryptr://mobile-app',
  defaultRedirectUri: 'cryptr://mobile-app',
};

describe('getUniversalTokens', () => {
  test('should call proper response', async () => {
    fetch.mockResponseOnce(mockSuccessResponse.body, {
      status: mockSuccessResponse.status,
    });

    let params = { code: 'code', request_id: 'request_id' };
    let transaction = new Transaction(Locale.EN, config.defaultRedirectUri);
    let body = universalTokensBody(transaction, params, config);
    let url = universalTokenUrl(config);
    let resp = await jsonApiRequest(url, body);
    expect(resp).not.toBeNull();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(await resp.json()).toEqual(SUCCESSFULL_TOKEN_RESPONSE);
  });
});
