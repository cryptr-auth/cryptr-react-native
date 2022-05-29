import Foundation
import UIKit
import SwiftUI
import AuthenticationServices

@objc(Cryptr)
class Cryptr: NSObject {

  override init() {
    super.init()
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
