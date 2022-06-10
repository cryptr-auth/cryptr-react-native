import jwtDecode from 'jwt-decode';
import { JWT, RS256 } from './constants';
import type { JwtHeaderType, PreparedCryptrConfig } from './interfaces';

const COMMON_FIELDS: Array<string> = [
  'iss',
  'sub',
  'aud',
  'exp',
  'iat',
  'cid',
  'jti',
  'jtt',
  'scp',
  'tnt',
  'jtt',
];

/*
  +-----+--------------+--------+-------------------------------------+
  | Key |  Name        | Type   |  Example                            |
  +-----+--------------+--------+-------------------------------------+
  | iss | Issuer       | string | "shark-academy.cryptr.com"          |
  | sub | EndUser      | uuid   | uuid                                |
  | aud | Audience     | string | "shark-academy.com"                 |
  | exp | Expiration   | DtTime | "2039-01-01T00:00:00+00:00"         |
  | nbf | Not Before   | DtTime | "2038-04-01T00:00:00+00:00"         |
  | iat | Issued At    | DtTime | "2038-03-17T00:00:00+00:00"         |
  | cid | Client ID    | uuid   | Applicaiton id                      |
  | jti | Token UUID   | uuid   | Access id                           |
  | jtt | JWT Type     | string | "access"                            |
  | scp | Scope        | array  | "openid email"                      |
  | tnt | Tenant       | string | "shark-academy"                     |
  +-----+--------------+--------+-------------------------------------+
*/

const ACCESS_FIELDS = COMMON_FIELDS;

/*
  +-----------+--------------+--------+-----------------------------------------+
  | Key       | Name         | Type   | Example                                 |
  +-----------+--------------+--------+-----------------------------------------+
  | iss       | Issuer       | string | "shark-academy.cryptr.com" domain url   |
  | sub       | Subject      | uuid   |       can be the end user id            |
  | aud       | Audience     | string |       "front.shark-academy.com"         |
  | exp       | Expiration   | DtTime | :"2039-01-01T00:00:00+00:00"            |
  | nbf       | Not Before   | DtTime |  "2038-04-01T00:00:00+00:00"            |
  | iat       | Issued At    | DtTime |  "2038-03-17T00:00:00+00:00"            |
  | cid       | Client ID    | string | "307656e3-7a87-4c95-bad7-230a944897a2"  |
  | jti       | Token UUID   | uuid   | "38c85140-4e24-4a61-821c-1955ae7df99d"  |
  | acr       | AuthContext  | string |  "acr: ""                               |
  | amr       | AuthMethod   | array  |   "swk" method defined by rfc8176       |
  | nonce     | Nonce        | string |  "nonce: "n-0S6_WzA2Mj"                 |
  | auth_time | Auth Time    | DtTime |  "2038-03-17T00:00:00+00:00"            |
  | tnt       | tenant       | string |               "shark-academy"           |
  +-----------+--------------+--------+-----------------------------------------+
*/

const ID_FIELDS = ['at_hash', 'c_hash', 'nonce'].concat(COMMON_FIELDS);

export const validatesFieldsExist = (
  jwtBody: any,
  fields: string[]
): void | boolean => {
  fields.forEach((field) => {
    if (!jwtBody.hasOwnProperty(field)) {
      throw new Error(field + ' is missing');
    }
  });

  return true;
};

const validatesHeaderFromToken = (token: any): void | true => {
  const header: JwtHeaderType = jwtDecode(token, {
    header: true,
  });
  return validatesHeader(header);
};

export const validatesHeader = (header: JwtHeaderType): void | true => {
  if (header.typ !== JWT) {
    throw new Error('The token must be a JWT');
  }

  if (header.alg !== RS256) {
    throw new Error('The token must be sign in RSA 256');
  }

  if (!header.hasOwnProperty('kid')) {
    throw new Error('The token need a kid (key identifier) in header');
  }

  return true;
};

export const validatesTimestamps = (jwtBody: any): void | true => {
  if (!Number.isInteger(jwtBody.exp)) {
    throw new Error('Expiration Time (exp) claim must be a present number');
  }
  if (!Number.isInteger(jwtBody.iat)) {
    throw new Error('Issued at (iat) claim must be a present number');
  }

  return true;
};

export const validatesAudience = (
  jwtBody: any,
  config: PreparedCryptrConfig
): void | boolean => {
  if (config.audience !== jwtBody.aud) {
    throw new Error(
      `Audience (aud) ${jwtBody.aud} claim is not compliant with ${config.audience} from config`
    );
  }
  return true;
};

export const validatesIssuer = (
  jwtBody: any,
  config: PreparedCryptrConfig,
  organization_domain?: string
): void | boolean => {
  const effectiveDomain = organization_domain || config.tenant_domain;
  const expectedIssuer = [config.cryptr_base_url, 't', effectiveDomain].join(
    '/'
  );
  const jwtBodyIssuer = jwtBody.iss;

  if (expectedIssuer !== jwtBodyIssuer) {
    throw new Error(
      `Issuer (iss) ${jwtBodyIssuer} is not compliant with ${expectedIssuer}`
    );
  }

  return true;
};

export const validatesClient = (
  jwtBody: any,
  config: PreparedCryptrConfig
): void | true => {
  if (config.client_id !== jwtBody.cid) {
    throw new Error(
      `Client id (cid) ${jwtBody.cid} claim is not compliant with ${config.client_id} from config`
    );
  }
  return true;
};

const validatesExpiration = (jwtBody: any): void | boolean => {
  const now = new Date(Date.now());
  const expiration = new Date(jwtBody.exp * 1000); // exp is in seconds

  if (now.getTime() > expiration.getTime()) {
    throw new Error(
      `Expiration (exp) is invalid, (${expiration.getTime()}) must be in the future`
    );
  }
  return true;
};

const validatesJwtBody = (
  jwtBody: any,
  config: PreparedCryptrConfig,
  organization_domain?: string
): void | boolean => {
  return (
    validatesTimestamps(jwtBody) &&
    validatesAudience(jwtBody, config) &&
    validatesIssuer(jwtBody, config, organization_domain) &&
    validatesClient(jwtBody, config) &&
    validatesExpiration(jwtBody)
  );
};

const Jwt = {
  body: (token: string): object | never => {
    return jwtDecode(token);
  },
  validatesAccessToken: (
    accessToken: string,
    config: PreparedCryptrConfig,
    organization_domain?: string
  ): boolean => {
    const jwtBody = Jwt.body(accessToken);
    validatesHeaderFromToken(accessToken);
    validatesJwtBody(jwtBody, config, organization_domain);
    validatesFieldsExist(jwtBody, ACCESS_FIELDS);

    return true;
  },
  validatesIdToken: (
    idToken: string,
    config: PreparedCryptrConfig,
    organization_domain?: string
  ): boolean => {
    const jwtBody = Jwt.body(idToken);
    validatesHeaderFromToken(idToken);
    validatesJwtBody(jwtBody, config, organization_domain);
    validatesFieldsExist(jwtBody, ID_FIELDS);

    return true;
  },
};

export default Jwt;
