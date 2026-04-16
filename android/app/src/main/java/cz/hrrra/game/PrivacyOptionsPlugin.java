package cz.hrrra.game;

import android.app.Activity;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.ump.UserMessagingPlatform;

@CapacitorPlugin(name = "PrivacyOptions")
public class PrivacyOptionsPlugin extends Plugin {
    @PluginMethod
    public void show(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity unavailable");
            return;
        }

        activity.runOnUiThread(() ->
            UserMessagingPlatform.showPrivacyOptionsForm(
                activity,
                formError -> {
                    if (formError != null) {
                        call.reject(formError.getMessage());
                    } else {
                        call.resolve();
                    }
                }
            )
        );
    }
}
