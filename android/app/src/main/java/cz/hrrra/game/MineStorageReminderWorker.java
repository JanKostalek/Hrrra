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
    static final String WORK_NAME_PRIMARY = "mine_storage_reminder_primary_work";
    static final String WORK_NAME_FOLLOWUP = "mine_storage_reminder_followup_work";
    static final String PREFS_NAME = "mine_storage_reminder_state";
    static final String PREF_ENABLED_PRIMARY = "enabled_primary";
    static final String PREF_ENABLED_FOLLOWUP = "enabled_followup";
    static final String INPUT_ENABLED_KEY = "enabledKey";
    static final String INPUT_NOTIFICATION_ID = "notificationId";
    static final String INPUT_TITLE = "title";
    static final String INPUT_TEXT = "text";
    static final String INPUT_BIG_TEXT = "bigText";

    private static final String CHANNEL_ID = "mine_storage_reminder";
    private static final int NOTIFICATION_ID_PRIMARY = 6106;
    private static final int NOTIFICATION_ID_FOLLOWUP = 6107;

    public MineStorageReminderWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    static void scheduleReminder(
        Context context,
        String workName,
        String enabledKey,
        int notificationId,
        long delayMs,
        String title,
        String text,
        String bigText
    ) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putBoolean(enabledKey, true).apply();

        long safeDelayMs = Math.max(0L, delayMs);
        OneTimeWorkRequest request = new OneTimeWorkRequest.Builder(
            MineStorageReminderWorker.class
        )
            .setInitialDelay(safeDelayMs, java.util.concurrent.TimeUnit.MILLISECONDS)
            .setInputData(
                new Data.Builder()
                    .putString(INPUT_ENABLED_KEY, enabledKey)
                    .putInt(INPUT_NOTIFICATION_ID, notificationId)
                    .putString(INPUT_TITLE, title)
                    .putString(INPUT_TEXT, text)
                    .putString(INPUT_BIG_TEXT, bigText)
                    .build()
            )
            .build();

        WorkManager.getInstance(context).enqueueUniqueWork(
            workName,
            ExistingWorkPolicy.REPLACE,
            request
        );
    }

    static void cancelReminder(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit()
            .putBoolean(PREF_ENABLED_PRIMARY, false)
            .putBoolean(PREF_ENABLED_FOLLOWUP, false)
            .apply();

        WorkManager.getInstance(context).cancelUniqueWork(WORK_NAME_PRIMARY);
        WorkManager.getInstance(context).cancelUniqueWork(WORK_NAME_FOLLOWUP);
        NotificationManagerCompat.from(context).cancel(NOTIFICATION_ID_PRIMARY);
        NotificationManagerCompat.from(context).cancel(NOTIFICATION_ID_FOLLOWUP);
    }

    static void cancelFollowupReminder(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putBoolean(PREF_ENABLED_FOLLOWUP, false).apply();

        WorkManager.getInstance(context).cancelUniqueWork(WORK_NAME_FOLLOWUP);
        NotificationManagerCompat.from(context).cancel(NOTIFICATION_ID_FOLLOWUP);
    }

    @NonNull
    @Override
    public Result doWork() {
        Context context = getApplicationContext();
        String enabledKey = getInputData().getString(INPUT_ENABLED_KEY);
        int notificationId = getInputData().getInt(INPUT_NOTIFICATION_ID, NOTIFICATION_ID_PRIMARY);
        String title = getInputData().getString(INPUT_TITLE);
        String text = getInputData().getString(INPUT_TEXT);
        String bigText = getInputData().getString(INPUT_BIG_TEXT);
        if (enabledKey == null || enabledKey.trim().isEmpty()) {
            return Result.success();
        }

        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        if (!prefs.getBoolean(enabledKey, false)) {
            NotificationManagerCompat.from(context).cancel(notificationId);
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
            .setContentTitle(title != null && !title.trim().isEmpty() ? title : "Mine storage reminder")
            .setContentText(text != null && !text.trim().isEmpty() ? text : "Open Hrrra and check the mine storage.")
            .setStyle(
                new NotificationCompat.BigTextStyle().bigText(
                    bigText != null && !bigText.trim().isEmpty()
                        ? bigText
                        : "Open Hrrra and check the mine storage. It should be ready to transfer again."
                )
            )
            .setContentIntent(contentIntent)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT);

        NotificationManagerCompat.from(context).notify(notificationId, builder.build());
        prefs.edit().putBoolean(enabledKey, false).apply();
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
