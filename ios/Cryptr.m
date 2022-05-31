#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import "RCTUtils.h"
#import <React/RCTEventEmitter.h>
#import <AuthenticationServices/ASWebAuthenticationSession.h>
#if RCT_DEV
#import <React/RCTDevLoadingView.h>
#endif

#import <UIKit/UIKit.h>

ASWebAuthenticationSession *_authenticationVCC;

#define REFRESH_TOKEN_KEY @"cryptr_user_refresh_token"

@interface RCT_EXTERN_MODULE(Cryptr, NSObject)

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(setRefresh:(NSString *)value
                    successCallback:(RCTResponseSenderBlock)successCallback
                    errorCallback:(RCTResponseSenderBlock)errorCallback)
{
    NSData* dataFromValue = [value dataUsingEncoding:NSUTF8StringEncoding];

    // Prepares the insert query structure
    NSDictionary* storeQuery = @{
        (__bridge id)kSecClass : (__bridge id)kSecClassGenericPassword,
        (__bridge id)kSecAttrAccount : REFRESH_TOKEN_KEY,
        (__bridge id)kSecValueData : dataFromValue
    };

    // Deletes the existing item prior to inserting the new one
    SecItemDelete((__bridge CFDictionaryRef)storeQuery);

    OSStatus insertStatus = SecItemAdd((__bridge CFDictionaryRef)storeQuery, nil);

    if (insertStatus == noErr) {
        successCallback(@[value]);
    }

     else {
       errorCallback(@[@"Error while storing refresh"]);
     }
}

- (void)openInSafari:(NSURL *)URL {
  UIApplication *application = [UIApplication sharedApplication];

  if ([application respondsToSelector:@selector(openURL:options:completionHandler:)]) {
      [application openURL:URL options:@{}
      completionHandler:^(BOOL success) {
          NSLog(@"Open %@: %d","scheme",success);
      }];
    } else {
      BOOL success = [application openURL:URL];
      NSLog(@"Open %@: %d","scheme",success);
    }
}

RCT_EXPORT_METHOD(removeRefresh:(RCTResponseSenderBlock)callback
                              errorCallback:(RCTResponseSenderBlock)errorCallback)
{
    NSDictionary* removeQuery = @{
      (__bridge id)kSecClass : (__bridge id)kSecClassGenericPassword,
      (__bridge id)kSecAttrAccount : REFRESH_TOKEN_KEY,
      (__bridge id)kSecReturnData : (__bridge id)kCFBooleanTrue
    };

    OSStatus removeStatus = SecItemDelete((__bridge CFDictionaryRef)removeQuery);

    if (removeStatus == noErr) {
        callback(@[@"Refresh removed"]);
    }

    else {
        NSError* error = [NSError errorWithDomain:[[NSBundle mainBundle] bundleIdentifier] code:removeStatus userInfo: nil];
        errorCallback(@[@"An error occured while removing value"]);
    }
}

RCT_EXPORT_METHOD(getRefresh:(RCTResponseSenderBlock)callback
                              errorCallback:(RCTResponseSenderBlock)errorCallback)
{
    NSDictionary* getQuery = @{
        (__bridge id)kSecClass : (__bridge id)kSecClassGenericPassword,
        (__bridge id)kSecAttrAccount : REFRESH_TOKEN_KEY,
        (__bridge id)kSecReturnData : (__bridge id)kCFBooleanTrue,
        (__bridge id)kSecMatchLimit : (__bridge id)kSecMatchLimitOne
    };

    CFTypeRef dataRef = NULL;
    OSStatus getStatus = SecItemCopyMatching((__bridge CFDictionaryRef)getQuery, &dataRef);

    if (getStatus == errSecSuccess) {
        NSString* storedValue = [[NSString alloc] initWithData: (__bridge NSData*)dataRef encoding: NSUTF8StringEncoding];
        callback(@[storedValue]);
    }

    else {
        errorCallback(@[@"No refresh found"]);
    }

}

RCT_EXPORT_METHOD(startSecuredView:(NSURL *)url
                  successCallback:(RCTResponseSenderBlock)successCallback
                  errorCallback:(RCTResponseSenderBlock)errorCallback)
{
    if (!url) {
        RCTLogError(@"You must specify a url.");
        return;
    }
    RCTLogInfo(@"You specified a url.");

    // NSString *urlStr = url.absoluteString;
    // if ([urlStr rangeOfString:@"slo-after-revoke-token"].location != NSNotFound) {
    //   [self openInSafari:url];
    //   return;
    // }

    if (@available(iOS 12.0, *)) {
        ASWebAuthenticationSession* session =
        [[ASWebAuthenticationSession alloc] initWithURL:url
                                      callbackURLScheme: @"cryptr"
                                      completionHandler:^(NSURL * _Nullable callbackURL,
                                                          NSError * _Nullable error) {
            _authenticationVCC = nil;

            if (callbackURL) {
                successCallback(@[callbackURL.absoluteString]);
            } else if(error) {
              errorCallback(@[[error localizedDescription]]);
            }

        }];

        #if __IPHONE_OS_VERSION_MAX_ALLOWED >= 130000
        if (@available(iOS 13.0, *)) {
            session.presentationContextProvider = self;
            // if ([urlStr rangeOfString:@"slo-after-revoke-token"].location == NSNotFound) {
            //   session.prefersEphemeralWebBrowserSession = true;
            // }
        }
        #endif

        _authenticationVCC = session;

        [session start];
    } else {
      [self openInSafari:url];
      return;
    }
}

#if __IPHONE_OS_VERSION_MAX_ALLOWED >= 130000
#pragma mark - ASWebAuthenticationPresentationContextProviding

- (ASPresentationAnchor)presentationAnchorForWebAuthenticationSession:(ASWebAuthenticationSession *)session  API_AVAILABLE(ios(13.0)){
   return UIApplication.sharedApplication.keyWindow;
}
#endif

@end
