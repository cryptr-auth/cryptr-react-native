import Transaction from '../oauth/Transaction';
import {
  jsonApiRequest,
  universalTokenUrl,
  universalTokensBody,
} from '../utils/apiHelpers';
import { Locale } from '../utils/enums';
import type { PreparedCryptrConfig } from '../utils/interfaces';
import { SUCCESSFULL_TOKEN_RESPONSE } from './mocks/mockData';

import type { FetchMock } from 'jest-fetch-mock';

const fetchMock = fetch as FetchMock;

const mockSuccessResponse = {
  status: 201,
  body: JSON.stringify(SUCCESSFULL_TOKEN_RESPONSE),
};

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
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('should call proper response', async () => {
    fetchMock.mockResponseOnce(mockSuccessResponse.body, {
      status: mockSuccessResponse.status,
    });

    let params = { code: 'code', request_id: 'request_id' };
    let transaction = new Transaction(Locale.EN, config.defaultRedirectUri);
    let body = universalTokensBody(transaction, params, config);
    let url = universalTokenUrl(config, 'org-domain');
    let resp = await jsonApiRequest(url, body);
    expect(resp).not.toBeNull();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(await resp.json()).toEqual(SUCCESSFULL_TOKEN_RESPONSE);
  });
});
