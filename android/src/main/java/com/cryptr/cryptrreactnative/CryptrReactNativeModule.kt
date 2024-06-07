package com.cryptr.cryptrreactnative

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.net.Uri
import android.os.Bundle
import android.util.Log


import androidx.annotation.Nullable
import androidx.browser.customtabs.CustomTabsCallback
import androidx.browser.trusted.TrustedWebActivityIntentBuilder
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

import com.google.androidbrowserhelper.trusted.TwaLauncher

import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap

import com.facebook.react.modules.core.DeviceEventManagerModule

class CryptrReactNativeModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), ActivityEventListener {
  val TAG = "[Android] Cryptr Module"
  var context: Context
  var rContext: ReactApplicationContext
  var completionCallback: Callback? = null

  private val REFRESH_TOKEN_KEY = "cryptr_user_refresh_token"

  private val NATIVE_MODULE_NAME = "RNEncryptedStorage"
  private val SHARED_PREFERENCES_FILENAME = "RN_ENCRYPTED_STORAGE_SHARED_PREF"

  private var sharedPreferences: SharedPreferences

  init {
    Log.d(TAG, "Init")
    reactContext.addActivityEventListener(this)
    this.context = reactContext.getApplicationContext()
    this.rContext = reactContext;

    val masterKey: MasterKey = MasterKey.Builder(context)
      .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
      .build()

    sharedPreferences = EncryptedSharedPreferences.create(
      context,
      SHARED_PREFERENCES_FILENAME,
      masterKey,
      EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
      EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )
  }

  override fun getName(): String {
    return "CryptrReactNative"
  }

  override fun onActivityResult(p0: Activity, p1: Int, p2: Int, p3: Intent?) {
    Log.d(TAG, "onActivityResult")
  }

  override fun onNewIntent(p0: Intent) {
    if(p0.data !== null) {
      completionCallback?.invoke(p0.data.toString())
    }
  }

  fun eventToString(navigationEvent: Int): String? {
    return when (navigationEvent) {
      CustomTabsCallback.NAVIGATION_STARTED -> "Navigation Started"
      CustomTabsCallback.NAVIGATION_FINISHED -> "Navigation Finished"
      CustomTabsCallback.NAVIGATION_FAILED -> "Navigation Failed"
      CustomTabsCallback.NAVIGATION_ABORTED -> "Navigation Aborted"
      CustomTabsCallback.TAB_SHOWN -> "Tab Shown"
      else -> "Unknown event"
    }
  }

  private fun sendEvent(eventName: String, params: WritableMap?) {
    this.rContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(eventName, params)
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun setRefresh(refreshToken: String, successCallback: Callback, errorCallback: Callback) {
    val editor: SharedPreferences.Editor = this.sharedPreferences.edit();
    editor.putString(REFRESH_TOKEN_KEY, refreshToken)
    if(editor.commit()) {
      successCallback.invoke(refreshToken)
    } else {
      errorCallback.invoke("Error while storing refresh")
    }
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun getRefresh(successCallback: Callback, errorCallback: Callback) {
    this.sharedPreferences.getString(REFRESH_TOKEN_KEY, null)?.let { token ->
    successCallback.invoke(token);
   } ?: run {
      errorCallback.invoke("No refresh found")
   };
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun removeRefresh(successCallback: Callback, errorCallback: Callback) {
    val editor: SharedPreferences.Editor = this.sharedPreferences.edit();
    editor.remove(REFRESH_TOKEN_KEY);
    if(editor.commit()) {
      successCallback.invoke("Refresh removed")
    } else {
      errorCallback.invoke("Error while removing refresh")
    }
  }


  @ReactMethod(isBlockingSynchronousMethod = true)
  fun startAuthentication(
    uri: String,
    _no_popup_no_cookie: Boolean,
    successCallback: Callback,
    errorCallback: Callback,
  ) {
    this.completionCallback = successCallback
    val builder = TrustedWebActivityIntentBuilder(Uri.parse(uri))
    val launcher = TwaLauncher(getCurrentActivity())
    val ccCallback: CustomTabsCallback = object: CustomTabsCallback() {
      override fun onNavigationEvent(navigationEvent: Int, @Nullable extras: Bundle?) {
        Log.d(TAG, "onNavigationEvent")
        val params =
            Arguments.createMap().apply {
              putString("eventType", eventToString(navigationEvent).toString())
            }
        sendEvent("onNavigationEvent", params)
      }

      override fun extraCallback(callbackName: String, @Nullable args: Bundle?) {}
    }

    val completion = object: Runnable {
      override fun run() {Log.d(TAG, "completion")}
    }

    launcher.launch(builder, ccCallback, null, completion)
  }

  private fun bundleToString(bundle: Bundle?): String? {
    val b = StringBuilder()
    b.append("{")
    if (bundle != null) {
        var first = true
        for (key in bundle.keySet()) {
            if (!first) {
                b.append(", ")
            }
            first = false
            b.append(key)
            b.append(": ")
            b.append(bundle[key])
        }
    }
    b.append("}")
    return b.toString()
}

}
