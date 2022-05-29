import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package '@cryptr/cryptr-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

interface CryptrInterface {
  startSecuredView: (
    uri: string,
    successCallback?: (data: any) => any,
    errorCallback?: (error: any) => any
  ) => any;
  getRefresh: (
    successCallback?: (data: any) => any,
    errorCallback?: (error: any) => any
  ) => any;
  setRefresh: (
    refreshToken: string,
    successCallback?: (data: any) => any,
    errorCallback?: (error: any) => any
  ) => any;
}

const Cryptr = NativeModules.Cryptr
  ? NativeModules.Cryptr
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export default Cryptr as CryptrInterface;
