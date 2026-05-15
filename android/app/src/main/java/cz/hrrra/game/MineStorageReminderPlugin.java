package cz.hrrra.game;

import android.Manifest;
import android.os.Build;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(name = "MineStorageReminder",
    permissions = {
        @Permission(strings = { Manifest.permission.POST_NOTIFICATIONS }, alias = "PostNotifications")
    }
)
public class MineStorageReminderPlugin extends Plugin {
    private static final String PERMISSION_ALIAS = "PostNotifications";

    @PluginMethod
    public void sync(PluginCall call) {
        long delayMs = Math.max(0L, Math.round(call.getDouble("delayMs", 0.0)));
        if (delayMs <= 0L) {
            MineStorageReminderWorker.cancelReminder(getContext());
            resolveResult(call, 0L, 0L, false, false);
            return;
        }

        if (needsNotificationPermission()) {
            requestPermissionForAlias(PERMISSION_ALIAS, call, "syncPermissionCallback");
            return;
        }

        syncReminder(call, true);
    }

    @PermissionCallback
    public void syncPermissionCallback(PluginCall call) {
        boolean granted = getPermissionState(PERMISSION_ALIAS) == PermissionState.GRANTED;
        syncReminder(call, granted);
    }

    private boolean needsNotificationPermission() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            return false;
        }
        return getPermissionState(PERMISSION_ALIAS) != PermissionState.GRANTED;
    }

    private void syncReminder(PluginCall call, boolean permissionGranted) {
        long delayMs = Math.max(0L, Math.round(call.getDouble("delayMs", 0.0)));
        long followupDelayMs = Math.max(0L, Math.round(call.getDouble("followupDelayMs", 0.0)));
        if (delayMs <= 0L || !permissionGranted) {
            MineStorageReminderWorker.cancelReminder(getContext());
            resolveResult(call, delayMs, followupDelayMs, permissionGranted, false);
            return;
        }

        MineStorageReminderWorker.scheduleReminder(
            getContext(),
            MineStorageReminderWorker.WORK_NAME_PRIMARY,
            MineStorageReminderWorker.PREF_ENABLED_PRIMARY,
            6106,
            delayMs,
            "Mine storage reminder",
            "Open Hrrra and check the mine storage.",
            "Open Hrrra and check the mine storage. It should be ready to transfer again."
        );

        if (followupDelayMs > 0L) {
            MineStorageReminderWorker.scheduleReminder(
                getContext(),
                MineStorageReminderWorker.WORK_NAME_FOLLOWUP,
                MineStorageReminderWorker.PREF_ENABLED_FOLLOWUP,
                6107,
                followupDelayMs,
                "Mine storage reminder",
                "Open Hrrra and check the mine storage.",
                "Open Hrrra and check the mine storage. If the storage is still full, it is a good time to transfer again."
            );
        } else {
            MineStorageReminderWorker.cancelFollowupReminder(getContext());
        }

        resolveResult(call, delayMs, followupDelayMs, true, true);
    }

    private void resolveResult(PluginCall call, long delayMs, long followupDelayMs, boolean permissionGranted, boolean scheduled) {
        JSObject result = new JSObject();
        result.put("delayMs", delayMs);
        result.put("followupDelayMs", followupDelayMs);
        result.put("permissionGranted", permissionGranted);
        result.put("scheduled", scheduled);
        call.resolve(result);
    }
}
