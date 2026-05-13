package cz.hrrra.game;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.work.Data;
import androidx.work.ExistingWorkPolicy;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

public class MineStorageReminderWorker extends Worker {
    static final String WORK_NAME = "mine_storage_reminder_work";
    static final String PREFS_NAME = "mine_storage_reminder_state";
    static final String PREF_ENABLED = "enabled";
    static final String INPUT_DELAY_MS = "delayMs";

    private static final String CHANNEL_ID = "mine_storage_reminder";
    private static final int NOTIFICATION_ID = 6106;

    public MineStorageReminderWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    static void scheduleReminder(Context context, long delayMs) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putBoolean(PREF_ENABLED, true).apply();

        long safeDelayMs = Math.max(0L, delayMs);
        OneTimeWorkRequest request = new OneTimeWorkRequest.Builder(
            MineStorageReminderWorker.class
        )
            .setInitialDelay(safeDelayMs, java.util.concurrent.TimeUnit.MILLISECONDS)
            .setInputData(new Data.Builder().putLong(INPUT_DELAY_MS, safeDelayMs).build())
            .build();

        WorkManager.getInstance(context).enqueueUniqueWork(
            WORK_NAME,
            ExistingWorkPolicy.REPLACE,
            request
        );
    }

    static void cancelReminder(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putBoolean(PREF_ENABLED, false).apply();

        WorkManager.getInstance(context).cancelUniqueWork(WORK_NAME);
        NotificationManagerCompat.from(context).cancel(NOTIFICATION_ID);
    }

    @NonNull
    @Override
    public Result doWork() {
        Context context = getApplicationContext();
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        if (!prefs.getBoolean(PREF_ENABLED, false)) {
            NotificationManagerCompat.from(context).cancel(NOTIFICATION_ID);
            return Result.success();
        }

        if (!NotificationManagerCompat.from(context).areNotificationsEnabled()) {
            return Result.success();
        }

        ensureChannel(context);
        Intent intent = new Intent(context, MainActivity.class);
        intent.setFlags(
            Intent.FLAG_ACTIVITY_NEW_TASK |
            Intent.FLAG_ACTIVITY_CLEAR_TOP |
            Intent.FLAG_ACTIVITY_SINGLE_TOP
        );

        PendingIntent contentIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle("Mine storage reminder")
            .setContentText("Open Hrrra and check the mine storage.")
            .setStyle(new NotificationCompat.BigTextStyle().bigText("Open Hrrra and check the mine storage. It should be ready to transfer again."))
            .setContentIntent(contentIntent)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT);

        NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, builder.build());
        prefs.edit().putBoolean(PREF_ENABLED, false).apply();
        return Result.success();
    }

    private static void ensureChannel(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return;
        }

        NotificationManager manager = context.getSystemService(NotificationManager.class);
        if (manager == null || manager.getNotificationChannel(CHANNEL_ID) != null) {
            return;
        }

        NotificationChannel channel = new NotificationChannel(
            CHANNEL_ID,
            "Mine reminders",
            NotificationManager.IMPORTANCE_DEFAULT
        );
        channel.setDescription("Reminders after mine transfers.");
        manager.createNotificationChannel(channel);
    }
}
