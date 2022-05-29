import { DEFAULT_SCOPE } from '../utils/constants';
import { Locale, Sign } from '../utils/enums';
import uuid from 'react-native-uuid';
import Pkce from './Pkce';
import { deviceCryptrLocale } from '../utils/helpers';

class Transaction {
  readonly signType: Sign = Sign.SIGNIN;
  readonly scope: string = DEFAULT_SCOPE;
  readonly locale: Locale;
  readonly redirectUri: string;
  readonly nonce: string = uuid.v4().toString();
  readonly pkce: Pkce = new Pkce();

  constructor(
    redirectUri: string,
    signType?: Sign,
    scope?: string,
    locale?: Locale
  ) {
    if (locale !== undefined) {
      this.locale = locale;
    } else {
      this.locale = deviceCryptrLocale();
    }

    if (signType !== undefined) {
      this.signType = signType;
    }
    if (scope !== undefined) {
      this.scope = scope;
    }
    this.redirectUri = redirectUri;
  }
}

export default Transaction;
