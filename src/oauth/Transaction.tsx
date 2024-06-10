import { DEFAULT_SCOPE } from '../utils/constants';
import { Locale } from '../utils/enums';
import Pkce from './Pkce';
import uuid from 'react-native-uuid';

class Transaction {
  readonly scope: string = DEFAULT_SCOPE;
  readonly locale: Locale;
  readonly redirectUri: string;
  readonly nonce: string = uuid.v4().toString();
  readonly pkce: Pkce = new Pkce();

  constructor(locale: Locale, redirectUri: string, scope?: string) {
    this.locale = locale;
    this.redirectUri = redirectUri;
    if (scope !== undefined) this.scope = scope;
  }
}

export default Transaction;
