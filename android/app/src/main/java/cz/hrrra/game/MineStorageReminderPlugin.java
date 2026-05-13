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
        boolean enabled = call.getBoolean("enabled", false);
        if (!enabled) {
            MineStorageReminderWorker.cancelReminder(getContext());
            resolveResult(call, false, false);
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
        boolean enabled = call.getBoolean("enabled", false);
        if (!enabled || !permissionGranted) {
            MineStorageReminderWorker.cancelReminder(getContext());
            resolveResult(call, enabled, permissionGranted);
            return;
        }

        MineStorageReminderWorker.scheduleReminder(getContext());
        resolveResult(call, true, true);
    }

    private void resolveResult(PluginCall call, boolean enabled, boolean permissionGranted) {
        JSObject result = new JSObject();
        result.put("enabled", enabled);
        result.put("permissionGranted", permissionGranted);
        result.put("scheduled", enabled && permissionGranted);
        call.resolve(result);
    }
}
