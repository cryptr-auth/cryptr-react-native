import Foundation
import UIKit
import SwiftUI
import AuthenticationServices

@objc(CryptrReactNative)
class CryptrReactNative: NSObject {

  // @objc(multiply:withB:withResolver:withRejecter:)
  // func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
  //   resolve(a*b)
  // }

  override init() {
    super.init()
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
