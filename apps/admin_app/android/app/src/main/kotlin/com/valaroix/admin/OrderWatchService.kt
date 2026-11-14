package com.valaroix.admin

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import androidx.core.app.NotificationCompat
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.TimeUnit

class OrderWatchService : Service() {

    companion object {
        const val FOREGROUND_NOTIFICATION_ID = 9824
        const val ONGOING_CHANNEL_ID = "valaroix_radar_ongoing_v1"
        const val ALERT_CHANNEL_ID = "valaroix_orders_high_priority_v2"
        const val PREFS_NAME = "valaroix_admin_radar_prefs"
        const val KEY_KNOWN_IDS = "known_order_ids"
    }

    private var scheduler: ScheduledExecutorService? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = buildOngoingNotification()
        startForeground(FOREGROUND_NOTIFICATION_ID, notification)

        startOrderPollingScheduler()

        return START_STICKY
    }

    override fun onDestroy() {
        scheduler?.shutdownNow()
        scheduler = null
        super.onDestroy()
    }

    private fun startOrderPollingScheduler() {
        if (scheduler != null && !scheduler!!.isShutdown) return

        scheduler = Executors.newSingleThreadScheduledExecutor()
        scheduler?.scheduleWithFixedDelay({
            try {
                checkForNewOrders()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }, 1, 5, TimeUnit.SECONDS)
    }

    private fun checkForNewOrders() {
        var connection: HttpURLConnection? = null
        try {
            val url = URL("https://valaroix.com/api/orders")
            connection = url.openConnection() as HttpURLConnection
            connection.connectTimeout = 8000
            connection.readTimeout = 8000
            connection.requestMethod = "GET"
            connection.setRequestProperty("Accept", "application/json")
            connection.setRequestProperty("User-Agent", "Valaroix-Admin-Radar")

            if (connection.responseCode == 200) {
                val reader = BufferedReader(InputStreamReader(connection.inputStream))
                val sb = StringBuilder()
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    sb.append(line)
                }
                reader.close()

                val json = JSONObject(sb.toString())
                val ordersArray = json.optJSONArray("orders") ?: return

                val prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                val savedIds = prefs.getStringSet(KEY_KNOWN_IDS, null)?.toMutableSet()

                if (savedIds == null) {
                    // Initial seed on first run
                    val initialSet = HashSet<String>()
                    for (i in 0 until ordersArray.length()) {
                        val o = ordersArray.optJSONObject(i) ?: continue
                        val id = o.optString("id", "")
                        if (id.isNotEmpty()) initialSet.add(id)
                    }
                    prefs.edit().putStringSet(KEY_KNOWN_IDS, initialSet).apply()
                } else {
                    val newOrders = mutableListOf<JSONObject>()
                    val currentIds = HashSet<String>()

                    for (i in 0 until ordersArray.length()) {
                        val o = ordersArray.optJSONObject(i) ?: continue
                        val id = o.optString("id", "")
                        val status = o.optString("status", "").lowercase()
                        if (id.isNotEmpty()) {
                            currentIds.add(id)
                            if (!savedIds.contains(id) && (status.contains("pending") || status.isEmpty())) {
                                newOrders.add(o)
                            }
                        }
                    }

                    if (newOrders.isNotEmpty()) {
                        for (order in newOrders) {
                            triggerLoudOrderAlert(order)
                        }
                        savedIds.addAll(currentIds)
                        prefs.edit().putStringSet(KEY_KNOWN_IDS, savedIds).apply()
                    }
                }
            }
        } catch (e: Exception) {
            // Network errors are ignored during background polling
        } finally {
            connection?.disconnect()
        }
    }

    private fun triggerLoudOrderAlert(order: JSONObject) {
        val id = order.optString("id", "VLX")
        val name = order.optString("customerName", "Customer")
        val total = order.optInt("total", 3000)
        val city = order.optString("city", "Pakistan")
        val item = order.optString("item", "VALAROIX Parfum")

        // 1. Wake up the phone screen even if device is locked / sleeping on a table
        try {
            val pm = getSystemService(Context.POWER_SERVICE) as PowerManager
            @Suppress("DEPRECATION")
            val wakeLock = pm.newWakeLock(
                PowerManager.SCREEN_BRIGHT_WAKE_LOCK or PowerManager.ACQUIRE_CAUSES_WAKEUP or PowerManager.ON_AFTER_RELEASE,
                "valaroix:order_alert_wake"
            )
            wakeLock.acquire(4000)
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // 2. Play audible ringtone alert and build heads-up notification
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)

        val launchIntent = packageManager.getLaunchIntentForPackage(packageName)?.apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            this,
            (System.currentTimeMillis() % 100000).toInt(),
            launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val title = "🔔 NAYA ORDER AAYA HAI! #$id"
        val message = "$name ($city) ne $item order kiya! Total Rs. $total (COD)"

        val iconId = applicationInfo.icon

        val builder = NotificationCompat.Builder(this, ALERT_CHANNEL_ID)
            .setSmallIcon(iconId)
            .setContentTitle(title)
            .setContentText(message)
            .setStyle(NotificationCompat.BigTextStyle().bigText(message))
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .setSound(soundUri)
            .setVibrate(longArrayOf(0, 500, 200, 500, 200, 500))
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .setFullScreenIntent(pendingIntent, true)

        notificationManager.notify((System.currentTimeMillis() % 100000).toInt(), builder.build())
    }

    private fun buildOngoingNotification(): android.app.Notification {
        val launchIntent = packageManager.getLaunchIntentForPackage(packageName)?.apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, ONGOING_CHANNEL_ID)
            .setSmallIcon(applicationInfo.icon)
            .setContentTitle("👑 VALAROIX Admin Radar")
            .setContentText("24/7 background order monitoring active")
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setOngoing(true)
            .setContentIntent(pendingIntent)
            .build()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            // 1. Silent Ongoing Background Channel
            val ongoingChannel = NotificationChannel(
                ONGOING_CHANNEL_ID,
                "VALAROIX Live Radar Service",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Keeps VALAROIX alive in the background for instant order alerts"
                setShowBadge(false)
            }
            notificationManager.createNotificationChannel(ongoingChannel)

            // 2. High-Priority Alert Siren Channel
            val soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
            val audioAttributes = AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_NOTIFICATION_COMMUNICATION_INSTANT)
                .build()

            val alertChannel = NotificationChannel(
                ALERT_CHANNEL_ID,
                "VALAROIX High Priority Orders",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Heads-up sound, screen wake, and vibration alerts for perfume orders"
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 500, 200, 500, 200, 500)
                enableLights(true)
                setShowBadge(true)
                lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
                setSound(soundUri, audioAttributes)
            }
            notificationManager.createNotificationChannel(alertChannel)
        }
    }
}
