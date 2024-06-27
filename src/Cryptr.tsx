// import { NativeModules, Platform } from 'react-native';
import { NativeModules } from 'react-native';
import type CryptrInterface from './utils/interfaces';

// const LINKING_ERROR =
//   `The package '@cryptr/cryptr-react-native' doesn't seem to be linked. Make sure: \n\n` +
//   Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
//   '- You rebuilt the app after installing the package\n' +
//   '- You are not using Expo Go\n';

const CryptrReactNative = NativeModules.CryptrReactNative
  ? NativeModules.CryptrReactNative
  : new Proxy(
      {},
      {
        get() {
          // throw new Error(LINKING_ERROR);
        },
      }
    );

export default CryptrReactNative as CryptrInterface;
