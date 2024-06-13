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

export type Identity = {
  idp_id: string;
  authenticated_at: number;
  provider: string;
  data?: MetadataType;
};

export type CryptrUser = {
  at_hash: string;
  aud: string;
  c_hash: string;
  email: string;
  email_verified: boolean;
  env?: string;
  exp: number;
  iat: number;
  identities: Identity[];
  idp_user_id?: string;
  jti: string;
  jtt: string;
  nonce: string;
  meta_data?: MetadataType;
  org: string;
  phone_number_verified: boolean;
  profile?: MetadataType;
  scp?: string[];
  sub: string;
  ver: number;
};
