package cz.hrrra.game;

import android.app.Activity;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.UserMessagingPlatform;

@CapacitorPlugin(name = "RewardedContinue")
public class RewardedContinuePlugin extends Plugin {
    private static final String TEST_REWARDED_AD_UNIT_ID = "ca-app-pub-3940256099942544/5224354917";
    private static final boolean USE_TEST_REWARDED_ADS = false;
    private static boolean adsInitialized = false;
    private PluginCall pendingCall;
    private RewardedAd rewardedAd;
    private boolean adFlowActive = false;
    private boolean rewardEarned = false;

    @PluginMethod
    public void show(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity unavailable");
            return;
        }

        if (adFlowActive) {
            call.reject("Rewarded ad is already in progress");
            return;
        }

        adFlowActive = true;
        rewardEarned = false;
        pendingCall = call;
        call.setKeepAlive(true);

        activity.runOnUiThread(() -> requestConsentAndShow(activity));
    }

    private void requestConsentAndShow(Activity activity) {
        ConsentInformation consentInformation = UserMessagingPlatform.getConsentInformation(activity);
        ConsentRequestParameters params = new ConsentRequestParameters.Builder().build();

        consentInformation.requestConsentInfoUpdate(
            activity,
            params,
            () -> {
                if (consentInformation.canRequestAds()) {
                    loadAndShowRewardedAd(activity);
                    return;
                }

                UserMessagingPlatform.loadAndShowConsentFormIfRequired(
                    activity,
                    formError -> {
                        if (consentInformation.canRequestAds()) {
                            loadAndShowRewardedAd(activity);
                        } else {
                            failPending("Ads consent is unavailable");
                        }
                    }
                );
            },
            requestError -> {
                if (consentInformation.canRequestAds()) {
                    loadAndShowRewardedAd(activity);
                } else {
                    failPending(requestError != null ? requestError.getMessage() : "Unable to request ad consent");
                }
            }
        );
    }

    private void initializeAdsIfNeeded(Activity activity) {
        if (adsInitialized) {
            return;
        }

        adsInitialized = true;
        MobileAds.initialize(activity, initializationStatus -> {});
    }

    private void loadAndShowRewardedAd(Activity activity) {
        initializeAdsIfNeeded(activity);

        rewardedAd = null;
        rewardEarned = false;

        RewardedAd.load(
            activity,
            getRewardedAdUnitId(),
            new AdRequest.Builder().build(),
            new RewardedAdLoadCallback() {
                @Override
                public void onAdLoaded(RewardedAd ad) {
                    rewardedAd = ad;
                    rewardedAd.setFullScreenContentCallback(
                        new FullScreenContentCallback() {
                            @Override
                            public void onAdDismissedFullScreenContent() {
                                rewardedAd = null;
                                if (rewardEarned) {
                                    finishSuccess();
                                } else {
                                    failPending("Rewarded ad was closed before reward");
                                }
                            }

                            @Override
                            public void onAdFailedToShowFullScreenContent(AdError adError) {
                                rewardedAd = null;
                                failPending(adError != null ? adError.getMessage() : "Rewarded ad failed to show");
                            }
                        }
                    );

                    try {
                        rewardedAd.show(activity, rewardItem -> rewardEarned = true);
                    } catch (RuntimeException exception) {
                        failPending(exception.getMessage() != null ? exception.getMessage() : "Rewarded ad failed to display");
                    }
                }

                @Override
                public void onAdFailedToLoad(LoadAdError loadAdError) {
                    failPending(loadAdError != null ? loadAdError.getMessage() : "Rewarded ad failed to load");
                }
            }
        );
    }

    private String getRewardedAdUnitId() {
        if (USE_TEST_REWARDED_ADS) {
            return TEST_REWARDED_AD_UNIT_ID;
        }

        return BuildConfig.ADMOB_REWARDED_AD_UNIT_ID;
    }

    private void finishSuccess() {
        if (pendingCall == null) {
            resetState();
            return;
        }

        JSObject result = new JSObject();
        result.put("rewarded", true);
        pendingCall.resolve(result);
        resetState();
    }

    private void failPending(String message) {
        if (pendingCall != null) {
            pendingCall.reject(message);
        }
        resetState();
    }

    private void resetState() {
        pendingCall = null;
        rewardedAd = null;
        adFlowActive = false;
        rewardEarned = false;
    }
}
