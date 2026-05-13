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

@CapacitorPlugin(
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
            resolveResult(call, 0L, false, false);
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
        if (delayMs <= 0L || !permissionGranted) {
            MineStorageReminderWorker.cancelReminder(getContext());
            resolveResult(call, delayMs, permissionGranted, false);
            return;
        }

        MineStorageReminderWorker.scheduleReminder(getContext(), delayMs);
        resolveResult(call, delayMs, true, true);
    }

    private void resolveResult(PluginCall call, long delayMs, boolean permissionGranted, boolean scheduled) {
        JSObject result = new JSObject();
        result.put("delayMs", delayMs);
        result.put("permissionGranted", permissionGranted);
        result.put("scheduled", scheduled);
        call.resolve(result);
    }
}
