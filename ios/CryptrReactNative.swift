import Foundation
import UIKit
import SwiftUI
import AuthenticationServices

@objc(CryptrReactNative)
class CryptrReactNative: NSObject {

  override init() {
    super.init()
 }

  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
