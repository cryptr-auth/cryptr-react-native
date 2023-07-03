# @cryptr/cryptr-react-native

React Native SDK for Cryptr Authentication through SSO

## Summary

- [@cryptr/cryptr-react-native](#cryptrcryptr-react-native)
  - [Summary](#summary)
  - [Expo integration](#expo-integration)
  - [Prerequisites](#prerequisites)
    - [Android](#android)
    - [iOS](#ios)
  - [Installation](#installation)
    - [1 - Create Mobile Application on Cryptr](#1---create-mobile-application-on-cryptr)
    - [2 - Dependency](#2---dependency)
    - [3 - Android](#3---android)
  - [Usage](#usage)
    - [Basis](#basis)
      - [iOS Alert dialog on SSO log in](#ios-alert-dialog-on-sso-log-in)
    - [Hooks](#hooks)
      - [isAuthenticated](#isauthenticated)
      - [user](#user)
      - [accessToken](#accesstoken)
      - [idToken](#idtoken)
      - [signinWithSSO](#signinwithsso)
      - [refreshTokens](#refreshtokens)
      - [logOut](#logout)
      - [error](#error)
      - [isLoading](#isloading)
    - [Components](#components)

## Expo integration

:warning: this is not compatible with Expo Go (neither `link`) and requires a run (`expo run`)

## Prerequisites

### Android

Support with `minSdkVersion=23`

### iOS

Full support with `iOS>=13.0`

## Installation

### 1 - Create Mobile Application on Cryptr

Through your API or on your dashboard create a react-native application with the following attributes:

| Attribute Name | Value |
| --- | --- |
| Name | Desired name for your App |
| Application type | `mobile` |
| Allowed Redirect URI | `cryptr://your-tenant` |

*⚠️ Choose wisely your domain to avoid conflicts with other apps.*

When the application is registered, the configuration will be displayed, keep it for implementation.

### 2 - Dependency

```sh
# Yarn
yarn add @cryptr/cryptr-react-native

# NPM
npm install @cryptr/cryptr-react-native
```

### 3 - Android

**Check your minSdkVersion**

In `android/build.gradle` check that the version is `23` or greater

```
//android/build.gradle
minSdkVersion = 23
```

**Update your manifestPlaceholders**

In `android/app/build.gradle` setup as below. If `manifestPlaceholders` is not present add it with proper values.

```
android {
  //...
  defaultConfig {
    //...
    manifestPlaceholders = [cryptrDomain: "your-tenant", cryptrScheme: "cryptr"]
  }
}
```

The `cryptrDomain` should have the same value in the allowed redirect URI for this app on Cryptr.

You are now good to go.

## Usage

### Basis

Cryptr implementation is based on React Context and Provider.
At the top level of your React Native App set the configuration you got on the first step, like this one:

```js
const config: CryptrConfig = {
  tenant_domain: 'YOUR_TENANT',
  client_id: 'APPLICATION_ID',
  audience: 'cryptr://YOUR_TENANT',
  default_redirect_uri: 'cryptr://YOUR_TENANT',
  region: Region.EU,
  cryptr_base_url: 'YOUR_SERVER_URL',
  dedicated_server: true, // if you have a dedicated server on cryptr
};
```

Then you can use it into `<CryptrProvider {...config}>`

Example:
Inside this Provider, you can handle Cryptr Authentication using our Hooks and/or components.

#### iOS Alert dialog on SSO log in

If you want to avoid the display of the below Alert dialog on iOS. you can add `no_popup_no_cookie: true` to your config.
![Capture d’écran 2022-06-14 à 19 05 54](https://user-images.githubusercontent.com/2788767/173638699-14f1f856-6559-46fa-88a0-fc770e0ebf6a.png)

**:warning: With this configuration, even the default browser has registered credentials, end-user will have to type them each type.**

### Hooks

access to our hooks  like this

```js
import { useCryptr } from `@cryptr/cryptr-react-native`

// ...

const { /* Any required hook */ } = useCryptr()
```

#### isAuthenticated

Hook to know if a Cryptr session is active

The return type is a <u>**boolean**</u>

```js
const { isAuthenticated } = useCryptr()

if(isAuthenticated) { /**/ }
```

#### user

Hook to retrieve the User information (extracted from current oAuth Cryptr active session ID Token)

The return type is a <u>**key/value pair Object.**</u>

```js
const { user } = useCryptr()

// ...
user()
```

#### accessToken

Hook to retrieve the current accessToken value

The return type is a <u>** nullable string**</u>.

```js
const { accessToken } = useCryptr()

//..
{accessToken && <Text>{accessToken}</Text>}
```

#### idToken

Hook to retrieve the current idToken value

The return type is a <u>**string**</u>.

```js
const { idToken } = useCryptr()

//...
{idToken && <Text>{idToken}</Text>}
```

--

Actions

#### signinWithSSO

Hook action to sign in the user using a specific SSO.
*Requires* `idpId` value.


```js
const { signinWithSSO } = useCryptr()

// [...]
signinWithSSO(idpID: string, successCallback?: (data: any) => any, errorCallback?: (data: any) => any)
```

#### refreshTokens

Hook action to refresh tokens to new ones.

```js
const { refreshTokens } = useCryptr()

// [...]
refreshTokens(callback?: (data: any) => any)
```

#### logOut

Hook action to log out the user.


```js
const { logOut } = useCryptr()

// [...]

logOut(successCallback?: (data: any) => any, errorCallback?: (data: any) => any)
```

--

#### error

Hook to know if a Cryptr error occured

The return type is a String

```js
const { error } = useCryptr()
```

#### isLoading

Hook to inform you that a Cryptr process is in progress.

The return type is a <u>**boolean**</u>

```js
const { isLoading } = useCryptr()
```

### Components

This SDK also includes Components to simplify your integration.

- `SsoSigInButton` to login using SSO (hides when session is already active [`autoHide={false}` to disable])
- `LogOutButton` to logout user (hides when no session is active [`autoHide={false}` to disable])
- `RefreshButton` to get new tokens (hides when session is already active [`autoHide={false}` to disable])
