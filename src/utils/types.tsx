import type { StyleProp, ViewStyle } from 'react-native';

export type CryptrButtonProps = {
  text?: string;
  autoHide?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<ViewStyle>;
  children?: JSX.Element;
  successCallback?: (data: any) => any;
  errorCallback?: (data: any) => any;
};

export type SignInButtonProps = CryptrButtonProps & {
  domain?: string;
  email?: string;
};

export type JwtHeaderType = {
  alg: string;
  typ: string;
  [key: string]: any;
};

export type JwtBodyObject = {
  [key: string]: any;
};

export type MetadataType = {
  [key: string]: any;
};

export type CryptrUser = {
  application_metadata?: MetadataType;
  at_hash: string;
  aud: string;
  c_hash: string;
  cid: string;
  dbs?: string;
  email: string;
  exp: number;
  family_name?: string;
  given_name?: string;
  iat: number;
  iss: string;
  jti: string;
  jtt: string;
  nonce: string;
  resource_owner_metadata?: MetadataType;
  s_hash?: string;
  scp: string[];
  sub: string;
  tnt: string;
  sci?: string;
  ips?: string;
  ver: number;
};
