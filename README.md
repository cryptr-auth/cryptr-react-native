# @cryptr/cryptr-react-native

React Native SDK for Cryptr Authentication through SSO

## Summary

  - [Prerequisites](#prerequisites)
    - [Android](#android)
    - [iOS](#ios)
  - [Installation](#installation)
    - [1 - Create Mobile Application on Cryptr](#1---create-mobile-application-on-cryptr)
    - [2 - Dependency](#2---dependency)
    - [3 - Android](#3---android)
  - [Usage](#usage)
    - [Basis](#basis)
    - [Hooks](#hooks)
    - [Components](#components)

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

In `android/build.gradle` check that the version is `23`

```
//android/build.gradle
minSdkVersion = 23
```

**Update your manifestPlaceholders**

In `android/app/build.gradle` setup as follow:

```
android {
  //...
  defaultConfig {
    //...
    manifestPlaceholders = [cryptrDomain: "your-tenant", cryptrScheme: "cryptr"]
  }
}
```

The `cryptrDomain` should have the same value in allowed redirect URI for this app on Cryptr.

You are now good to go.

## Usage

### Basis

Cryptr implementation is based on React Context and Provider.

At top level of your React Native App set your configuration you got on first step, as this one:

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

```js
// App.js

const config: CryptrConfig = {/*..*/};

const App = () => {
  return (
    <CryptrProvider {...config}>
    // Cryptr Auth Session context
    </CryptrProvider>
  )
}
```

Inside this Provider you can handle Cryptr Authentication using our Hooks and/or components.

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

#### signinWithSSOGateway

Hook action to sign in the user using Cryptr Gateway when you don't know what is the precise ID used by your end user. You can precise a subset of IDP_ID that user will be able to consume, if none end-user will be able to find his by email or organziation_domain.

When you set one string for `idpId` behavior is same as `signinWithSSO`

:warning: requires a proper setup of you different organization


```js
const { signinWithSSOGateway } = useCryptr()

// [...]
signinWithSSOGateway(idpID?: string | string[], successCallback?: (data: any) => any, errorCallback?: (data: any) => any)
```

#### refreshTokens

Hook action to refresh tokens to new ones.

```js
const { refreshTokens } = useCryptr()

// [...]
refreshTokens(callback?: (data: any) => any)
```

#### logOut

Hook action to log out user.


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

Hook to inform you about that a Cryptr process is in progress.

The return type is a <u>**boolean**</u>

```js
const { isLoading } = useCryptr()
```

### Components

This SDK also includes Component to simplify your integration.

- `SsoSigInButton` to login using SSO (hides when session is already active [`autoHide={false}` to disable])

- `SsoGatewayButton` to login using SSO Gateway (hides when session is already active [`autoHide={false}` to disable])
- `LogOutButton` to logout user (hides when no session is active [`autoHide={false}` to disable])
- `RefreshButton` to get new tokens (hides when session is already active [`autoHide={false}` to disable])
