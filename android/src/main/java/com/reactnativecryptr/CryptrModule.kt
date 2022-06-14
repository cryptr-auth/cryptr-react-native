package com.reactnativecryptr

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.content.Context
import androidx.annotation.Nullable
import androidx.browser.customtabs.CustomTabsCallback
import androidx.browser.trusted.TrustedWebActivityIntentBuilder
import androidx.lifecycle.lifecycleScope

import com.cryptr.auth.DEBUG_TAG
import com.google.androidbrowserhelper.trusted.TwaLauncher

import kotlin.random.Random
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import android.content.Intent
import android.app.Activity
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule

import android.R.attr.data

class CryptrModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {
    val TAG = "[Android] CryptrModule"
    var context: Context
    var rContext: ReactApplicationContext
    var completionCallback: Callback? = null

    private val REFRESH_TOKEN_KEY = "cryptr_user_refresh_token"

    private val NATIVE_MODULE_NAME = "RNEncryptedStorage"
    private val SHARED_PREFERENCES_FILENAME = "RN_ENCRYPTED_STORAGE_SHARED_PREF"

    private var sharedPreferences: SharedPreferences

  init {
      reactContext.addActivityEventListener(this)
      this.context = reactContext.getApplicationContext()
      this.rContext = reactContext;

      val key: MasterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

      sharedPreferences = EncryptedSharedPreferences.create(
        context,
        SHARED_PREFERENCES_FILENAME,
        key,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
      )
    }

    override fun getName(): String {
        return "Cryptr"
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
      Log.d(TAG, "onActivityResult")
    }

    override fun onNewIntent(intent: Intent?) {
      if(intent != null && intent.data != null) {
        completionCallback?.invoke(intent.data.toString())
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
      editor.putString(REFRESH_TOKEN_KEY, refreshToken);
      if(editor.commit()) {
        successCallback.invoke(refreshToken);
      } else {
        errorCallback.invoke("Error while storing refresh");
      }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getRefresh(successCallback: Callback, errorCallback: Callback) {
      this.sharedPreferences.getString(REFRESH_TOKEN_KEY, null)?.let { token ->
        successCallback.invoke(token);
      } ?: run {
        errorCallback.invoke("No refresh found")
      }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun removeRefresh(successCallback: Callback, errorCallback: Callback) {
       val editor: SharedPreferences.Editor = this.sharedPreferences.edit();
      editor.remove(REFRESH_TOKEN_KEY);
      if(editor.commit()) {
        successCallback.invoke("Refresh removed");
      } else {
        errorCallback.invoke("Error while removing refresh");
      }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun startSecuredView(
      uri: String,
      _no_popup_no_cookie: Bool,
      successCallback: Callback,
      errorCallback: Callback,
    ) {
      this.completionCallback = successCallback
      val builder = TrustedWebActivityIntentBuilder(Uri.parse(uri))
      val launcher = TwaLauncher(getCurrentActivity())
      val ccCallBack: CustomTabsCallback = object: CustomTabsCallback() {
         override fun onNavigationEvent(navigationEvent: Int, @Nullable extras: Bundle?) {
                val params = Arguments.createMap().apply {
                    putString("eventType", eventToString(navigationEvent).toString());
                }
                sendEvent("onNavigationEvent", params);
            }

            override fun extraCallback(callbackName: String, @Nullable args: Bundle?) {
            }
      }

      val completion = object: Runnable {
        override fun run() {Log.d(TAG, "completion")}
      }

      launcher.launch(builder, ccCallBack, null, completion);
    }

    private fun eventToString(navigationEvent: Int): String? {
        return when (navigationEvent) {
          CustomTabsCallback.NAVIGATION_STARTED -> "Navigation Started"
          CustomTabsCallback.NAVIGATION_FINISHED -> "Navigation Finished"
          CustomTabsCallback.NAVIGATION_FAILED -> "Navigation Failed"
          CustomTabsCallback.NAVIGATION_ABORTED -> "Navigation Aborted"
          CustomTabsCallback.TAB_SHOWN -> "Tab Shown"
          CustomTabsCallback.TAB_HIDDEN -> "Tab Hidden"
            else -> "Unknown Event"
        }
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
