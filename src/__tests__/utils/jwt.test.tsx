import jwtDecode from 'jwt-decode';
import type {
  JwtHeaderType,
  PreparedCryptrConfig,
} from '../../utils/interfaces';
import Jwt, {
  validatesAudience,
  validatesClient,
  validatesFieldsExist,
  validatesHeader,
  validatesIssuer,
  validatesTimestamps,
} from '../../utils/jwt';

let config: PreparedCryptrConfig = {
  tenant_domain: 'shark-academy',
  audience: 'cryptr://auth-natif',
  default_redirect_uri: 'cryptr://auth-natif',
  client_id: 'e2629eb9-3f56-4397-b19d-b85747cecd6b',
  cryptr_base_url: 'http://localhost:4000',
  dedicated_server: false,
  no_popup_no_cookie: false,
};

const validExpiredAccess =
  'eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC90L3NoYXJrLWFjYWRlbXkiLCJraWQiOiI5ZjhlNTE1MC1lNWIxLTQ4MWEtOTAyNS1mYzc2YmQ1Y2JlYmUiLCJ0eXAiOiJKV1QifQ.eyJhcHBsaWNhdGlvbl9tZXRhZGF0YSI6e30sImF1ZCI6ImNyeXB0cjovL2F1dGgtbmF0aWYiLCJjaWQiOiJlMjYyOWViOS0zZjU2LTQzOTctYjE5ZC1iODU3NDdjZWNkNmIiLCJkYnMiOiJzYW5kYm94IiwiZW1haWwiOiJqb2huLmRvZUBjcnlwdHIuY28iLCJleHAiOjE2NTQ3NDQ5MzUsImlhdCI6MTY1NDcwODkzNSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwL3Qvc2hhcmstYWNhZGVteSIsImp0aSI6Ijg3Y2Y4YzRmLWMwODItNDVmZC05OTY2LWViMDNkYWM1MzFkOCIsImp0dCI6ImFjY2VzcyIsInNjcCI6WyJvcGVuaWQiLCJlbWFpbCIsInByb2ZpbGUiXSwic3ViIjoiMTkzZmViMGYtMTdkYy00NTE4LTg4N2YtNTAxNDVmN2RmNzg2IiwidG50Ijoic2hhcmstYWNhZGVteSIsInZlciI6MX0.hm6scm5s2gpZFBqGH_DxiIdyZDvW9KFNN1sTYdDYjO88uQtRcXJstbRxzUGp-xhLkevcUoy_NhZH91Jtkk3L-3ZEiaSD-AQ_l0GkRaUi8Ft3KjQ6wy6_H71ESVYykivY7kiB3sgQ0LNbVYu8lBcWAYuR6mMAoPW46aQ4vE-m2PoSNR2ULvp3JFpSk72ojBeebxXT_AxgJphf5vBr8Y1AqGkFxcbWhqP-x-CIfGvOnXFO_MsufkgJJz1pcqBspuiGBz4C_0FcFjJI9zS6OYHUXGbYy6OtxY7BhQoq9qphalVLfNjzJ9pcMRKAfDXX99eEeBFwCuquJtEjlRYpgee577Nkl9o_tDKWMGhkw0YdigXNueO6YhfoaWWQL8jCt0hhcAQPlvcEtCPznQ2dhvprWqbk5TREWMRTN2bGfadaPtGXeWPPt7YLSBMii02WfkDOL6Rg0oO9KRwkgGEUmZQ9KEb9YJAQef5oLDY7R8bCoFalKPfYCHO1s736Qm2MJitUEu2yNIErmNCYUYlXDnseFs9dfY7Y_cyrZeqIqvp9ma2SnOrzagdXV7V7LwLMI1zeB_EkGbAFnx8Ekvwu2z372gg_XQMSF1SpYajPb_0fu_NfmAWro_BOfD7AAfC8GQ1_PAxqLqRr9eoCM3iUJ6GLQ_eKBS49scujwsA_qDGgvWI';

const validAccess =
  'eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC90L3NoYXJrLWFjYWRlbXkiLCJraWQiOiI5ZjhlNTE1MC1lNWIxLTQ4MWEtOTAyNS1mYzc2YmQ1Y2JlYmUiLCJ0eXAiOiJKV1QifQ.eyJhcHBsaWNhdGlvbl9tZXRhZGF0YSI6e30sImF1ZCI6ImNyeXB0cjovL2F1dGgtbmF0aWYiLCJjaWQiOiJlMjYyOWViOS0zZjU2LTQzOTctYjE5ZC1iODU3NDdjZWNkNmIiLCJkYnMiOiJzYW5kYm94IiwiZW1haWwiOiJqb2huLmRvZUBjcnlwdHIuY28iLCJleHAiOjE3MTc5MjE4ODEsImlhdCI6MTY1NDg0OTg4MSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwL3Qvc2hhcmstYWNhZGVteSIsImp0aSI6IjAyZmExZjJmLThlNzktNDUzZi04OTAwLTViMmM0MDVjZDY0NiIsImp0dCI6ImFjY2VzcyIsInNjcCI6WyJvcGVuaWQiLCJlbWFpbCIsInByb2ZpbGUiXSwic3ViIjoiMTkzZmViMGYtMTdkYy00NTE4LTg4N2YtNTAxNDVmN2RmNzg2IiwidG50Ijoic2hhcmstYWNhZGVteSIsInZlciI6MX0.ZaWKKuSGJpMhEaCdfp_DmPxGE-8-wHKy0_8rjPZZNXYy7HC-djxITq69cj_-jJ36-MyeM2KWd5Blig8feH2MQsHq-K2rlpgf6dGsEvXdQyqOn0O-DrfMaMhLVGbBYaOoxJUD-23L50SRUiIyfkSsDkJPqW6Js2Y4dcvH6mCh6sVPtlBJop2SCe2e1WATVGYukvGna-ViSaa1Bg0rCCQgiv7E0OCq9Gbv74pkJoLJbZF6nAnyb6tUB42ybxZUCnDLwMgRohrRJXI-I06UiEofld5baP0oPJZIz-AaiR5-M8kZmtGSQyQCr4Cjl4GDgcYaSv6tpoO_USVgkFEv76kbg_wOXfIah2HGRDXtgvQLVs0q8FlB3LBphsqCVCBSz4qI08uOjsk0O3Q4mTfyM8BqO3gfFrBakV6YeQBpgcSCWa203xLWd_xYTWKYntjyJhliGlX2ZmG94Vrc7VzPfwXvWeP5NzRtIuM1G2pdX-XELmLu1aUJsVG-JhqRrw-IqOYemfgxjqwDKNcGvVe4Ub4fKyADwgEdBKIbpQyRy0CQdkF32aMPg8Iz8uxzasSD4vlNJG-sNtrpkhyRwjkbJo5t9NNEEEst86mpKjcFQkHYtgVHXrqQaGQ9aA8J0bzbJkKUsfmfpmgoEjlUZz5-dRrY4LheG3b8ARPwjEsHYMp8hc8';

const validIdToken =
  'eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC90L3NoYXJrLWFjYWRlbXkiLCJraWQiOiI5ZjhlNTE1MC1lNWIxLTQ4MWEtOTAyNS1mYzc2YmQ1Y2JlYmUiLCJ0eXAiOiJKV1QifQ.eyJhcHBsaWNhdGlvbl9tZXRhZGF0YSI6e30sImF0X2hhc2giOiJUaEJ3YU8yYXBfc21TTjc3bEVTdHBBIiwiYXVkIjoiY3J5cHRyOi8vYXV0aC1uYXRpZiIsImNfaGFzaCI6IkNMVF9QY0psWXVta0dqYTFoMzVzekEiLCJjaWQiOiJlMjYyOWViOS0zZjU2LTQzOTctYjE5ZC1iODU3NDdjZWNkNmIiLCJkYnMiOiJzYW5kYm94IiwiZW1haWwiOiJqb2huLmRvZUBjcnlwdHIuY28iLCJleHAiOjE3MTc5MjE4ODEsImZhbWlseV9uYW1lIjoiRG9lIiwiZ2l2ZW5fbmFtZSI6IkpvaG4iLCJpYXQiOjE2NTQ4NDk4ODEsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC90L3NoYXJrLWFjYWRlbXkiLCJqdGkiOiIyNjIzM2Y4ZC01MmM3LTQ2ZmYtYTM3NS04NWNmM2M0NjVlNTciLCJqdHQiOiJvcGVuaWQiLCJub25jZSI6IjY2MjdiNDA0LTM4MmQtNDJjNC04NGYyLTRkMDAxYmRjZjdiYSIsInJlc291cmNlX293bmVyX21ldGFkYXRhIjp7ImNpdHkiOiJTYW4gRnJhbmNpc2NvIiwiZW1haWwiOiJqb2huLmRvZUBjcnlwdHIuY28iLCJmaXJzdF9uYW1lIjoiSm9obiIsImxhc3RfbmFtZSI6IkRvZSIsIm1vYmlsZV9waG9uZSI6Iis0MTExMjQzNTk4ODciLCJwcm9maWxlX3VybCI6Imh0dHBzOi8vcmFuZG9tdXNlci5tZS9hcGkvcG9ydHJhaXRzL21lbi80Mi5qcGciLCJzYW1sX25hbWVpZCI6ImpvaG4uZG9lQGNyeXB0ci5jbyIsInppcF9jb2RlIjoiMTIzNDUifSwic19oYXNoIjoiQ0xUX1BjSmxZdW1rR2phMWgzNXN6QSIsInNjcCI6WyJvcGVuaWQiLCJlbWFpbCIsInByb2ZpbGUiXSwic3ViIjoiMTkzZmViMGYtMTdkYy00NTE4LTg4N2YtNTAxNDVmN2RmNzg2IiwidG50Ijoic2hhcmstYWNhZGVteSIsInZlciI6MX0.P6xUWrngIcLdh19_1IRUH_tGNeXW15QCjc43kUwt73vUITTWgkM6Z3DSO7Ar6aoe49FWbs0HND7gjLYrjkl_Ta4j08r5wcg2nZbPHSmS-C5sAKdMXmKy1JcNZaiM9EHeF-P2neiZUcL1P7h2wUAWt4mMgkQrmE0vZ7OVizOrG86kkf0BhAWv20bzofoO878mJv64ITcHGo2Rpcf8blQbLe_9v--pwkpR7Yh7Hm45tfYqNp5NBZqTRsMsBDn_JMkjjmsi7gga1wz42-_mEOOauIB4zAVzyomnYsbd4Inaw7mbaxb_d_0GrQiu2hiJ1cP4yUmNUz5AqNzfqAfS4p5P4VHIWydDSxNJBZDW_rqRZrGR_jyY2FBy-7QEpoj7pxtgL-4X9x7n4y9RNlyJ67pW2Bjpl_toy216rn0L2xWgeC1DVdctwdErq5AqU1Yg51M1G0eOs4X_iuywUpM69g1XZGsfhHZoFzeIf3Y9DVYULdhDlb4NT1mrNgLZ1wRiPDdNlieNQLHsUSTkwh1DKyamaugqJbl-8bmWSfocIU5MguMmRdxUxJJwQZX26ppTipVJXFVBOLAo5yO1MckmwcgrVjExsGmvtOov2TpThrspuNKnblBcsw1JvrYelTGt2VUr0Nk_qtv62hDjXyVhwoQ4h6rWKBQ0NTMB8yhB-ab2glA';

describe('Jwt.body/1', () => {
  it('should returns proper body ', () => {
    expect(Jwt.body(validAccess)).toEqual({
      application_metadata: {},
      aud: 'cryptr://auth-natif',
      dbs: 'sandbox',
      cid: 'e2629eb9-3f56-4397-b19d-b85747cecd6b',
      email: 'john.doe@cryptr.co',
      exp: 1717921881,
      iat: 1654849881,
      iss: 'http://localhost:4000/t/shark-academy',
      jti: '02fa1f2f-8e79-453f-8900-5b2c405cd646',
      jtt: 'access',
      scp: ['openid', 'email', 'profile'],
      sub: '193feb0f-17dc-4518-887f-50145f7df786',
      tnt: 'shark-academy',
      ver: 1,
    });
  });

  it('should returns proper body even if expired', () => {
    expect(Jwt.body(validExpiredAccess)).toEqual({
      application_metadata: {},
      aud: 'cryptr://auth-natif',
      dbs: 'sandbox',
      cid: 'e2629eb9-3f56-4397-b19d-b85747cecd6b',
      email: 'john.doe@cryptr.co',
      exp: 1654744935,
      iat: 1654708935,
      iss: 'http://localhost:4000/t/shark-academy',
      jti: '87cf8c4f-c082-45fd-9966-eb03dac531d8',
      jtt: 'access',
      scp: ['openid', 'email', 'profile'],
      sub: '193feb0f-17dc-4518-887f-50145f7df786',
      tnt: 'shark-academy',
      ver: 1,
    });
  });

  it('should fail if empty string', () => {
    expect(() => Jwt.body('')).toThrow(
      "Invalid token specified: Cannot read property 'replace' of undefined"
    );
  });

  it('should fail if not jwt string', () => {
    expect(() => Jwt.body('azerty.azerty')).toThrowError();
  });
});

describe('Jwt.validatesAccessToken/2', () => {
  it('should return success if accessToken compatible with config and not epxired', () => {
    expect(Jwt.validatesAccessToken(validAccess, config)).toBeTruthy();
  });

  it('should throw error if accessToken expired', () => {
    expect(() =>
      Jwt.validatesAccessToken(validExpiredAccess, config)
    ).toThrowError(
      'Expiration (exp) is invalid, (1654744935000) must be in the future'
    );
  });
});

describe('validatesIdToken/2', () => {
  it('should return success if id token compatible with config and not epxired', () => {
    expect(Jwt.validatesIdToken(validIdToken, config)).toBeTruthy();
  });
});

describe('validatesFieldsExists/2', () => {
  it('should return true if valid', () => {
    expect(validatesFieldsExist(Jwt.body(validAccess), ['sub'])).toBeTruthy();
  });

  it('should throw error if field not present', () => {
    expect(() => validatesFieldsExist(Jwt.body(validAccess), ['user'])).toThrow(
      'user is missing'
    );
  });
});

describe('validatesHeader/1', () => {
  const header: JwtHeaderType = jwtDecode(validAccess, { header: true });
  it('should return true if valid header', () => {
    expect(validatesHeader(header)).toBeTruthy();
  });

  it('should throw error if wrong type', () => {
    expect(() => validatesHeader({ ...header, typ: 'TOK' })).toThrow(
      'The token must be a JWT'
    );
  });

  it('should throw error if wrong alg', () => {
    expect(() => validatesHeader({ ...header, alg: 'RAW' })).toThrow(
      'The token must be sign in RSA 256'
    );
  });

  it('should throw error if no kid', () => {
    expect(() =>
      validatesHeader({
        alg: 'RS256',
        typ: 'JWT',
      })
    ).toThrow('The token need a kid (key identifier) in header');
  });
});

describe('validatesTimestamps', () => {
  it('should returns true if exp and iat are number', () => {
    expect(validatesTimestamps(Jwt.body(validAccess))).toBeTruthy();
  });
  it('should throw error if exp no a number', () => {
    expect(() =>
      validatesTimestamps({ ...Jwt.body(validAccess), exp: '12' })
    ).toThrowError('Expiration Time (exp) claim must be a present number');
  });

  it('should throw iat error if exp no a number', () => {
    expect(() =>
      validatesTimestamps({ ...Jwt.body(validAccess), iat: '12' })
    ).toThrowError('Issued at (iat) claim must be a present number');
  });
});

describe('validatesAudience', () => {
  it('should return true if audience compatible with config', () => {
    expect(validatesAudience(Jwt.body(validAccess), config)).toBeTruthy();
  });

  it('should throw error if audience incompatible with config', () => {
    expect(() =>
      validatesAudience(Jwt.body(validAccess), {
        ...config,
        audience: 'http://app.example.com',
      })
    ).toThrow(
      'Audience (aud) cryptr://auth-natif claim is not compliant with http://app.example.com from config'
    );
  });
});

describe('validatesClient', () => {
  it('should return true if client compatible with config', () => {
    expect(validatesClient(Jwt.body(validAccess), config)).toBeTruthy();
  });

  it('should throw error if client incompatible with config', () => {
    expect(() =>
      validatesClient(Jwt.body(validAccess), {
        ...config,
        client_id: '02fa1f2f-8e79-453f-8900-5b2c405cd646',
      })
    ).toThrow(
      'Client id (cid) e2629eb9-3f56-4397-b19d-b85747cecd6b claim is not compliant with 02fa1f2f-8e79-453f-8900-5b2c405cd646 from config'
    );
  });
});

describe('validatesIssuer/2', () => {
  it('should return true if client compatible with config', () => {
    expect(validatesIssuer(Jwt.body(validAccess), config)).toBeTruthy();
  });

  it('should throw error if client incompatible with config', () => {
    expect(() =>
      validatesIssuer(Jwt.body(validAccess), {
        ...config,
        cryptr_base_url: 'http://app.server.com',
      })
    ).toThrow(
      'Issuer (iss) http://localhost:4000/t/shark-academy is not compliant with http://app.server.com/t/shark-academy'
    );
  });
});

describe('validatesIssuer/3', () => {
  it('should return true if organization domain same as token but different as tenant_domain', () => {
    expect(
      validatesIssuer(
        { ...Jwt.body(validAccess), iss: 'http://localhost:4000/t/my-tenant' },
        config,
        'my-tenant'
      )
    ).toBeTruthy();
  });

  it('should throw error if organization not matching either token or config', () => {
    expect(() =>
      validatesIssuer(Jwt.body(validAccess), config, 'some-tenant')
    ).toThrow(
      'Issuer (iss) http://localhost:4000/t/shark-academy is not compliant with http://localhost:4000/t/some-tenant'
    );
  });
});
