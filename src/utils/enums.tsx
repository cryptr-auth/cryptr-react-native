export enum Sign {
  INVITE = 'invite',
  SIGNIN = 'signin',
  SIGNUP = 'signup',
  REFRESH = 'refresh',
  SSO = 'sso',
}

export enum Locale {
  EN = 'en',
  FR = 'fr',
  // GB = 'gb',
}

export enum Region {
  EU = 'eu',
  US = 'us',
  // ASIA = 'asia',
}

export enum CryptrReducerActionKind {
  LOADING = 'loading',
  UNLOADING = 'unloading',
  AUTHENTICATED = 'authneticated',
  UNAUTHENTICATED = 'unauthneticated',
  ERROR = 'error',
}
