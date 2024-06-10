package com.cryptr.cryptrreactnative
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity

class CryptrAuthActivity: AppCompatActivity() {
  val TAG = "[Android] CryptrModule"

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    if (intent != null && intent != null) {
      val pm: PackageManager = getPackageManager()
      val rootIntent: Intent? =
          pm.getLaunchIntentForPackage(getApplicationContext().getPackageName())
      if (rootIntent != null) {
        rootIntent.setData(intent.data)
        try {
          startActivity(rootIntent)
          finish()
        } catch (e: Exception) {
          Log.e(TAG, e.toString())
        }
      }
    }
  }
}
