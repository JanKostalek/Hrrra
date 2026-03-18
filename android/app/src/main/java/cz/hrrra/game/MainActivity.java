package cz.hrrra.game;

import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.FrameLayout;
import android.widget.TextView;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.ump.ConsentForm;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.FormError;
import com.google.android.ump.UserMessagingPlatform;

public class MainActivity extends BridgeActivity {
    private FrameLayout adContainer;
    private TextView adDebugStatus;
    private AdView bannerView;
    private ConsentInformation consentInformation;
    private boolean adsInitialized = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(PrivacyOptionsPlugin.class);
        super.onCreate(savedInstanceState);
        adContainer = findViewById(R.id.ad_container);
        adDebugStatus = findViewById(R.id.ad_debug_status);
        configureWebViewCache();
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        hideSystemBars();
        requestConsentAndLoadAds();
    }

    @Override
    public void onResume() {
        super.onResume();
        hideSystemBars();
        if (bannerView != null) {
            bannerView.resume();
        }
    }

    @Override
    public void onPause() {
        if (bannerView != null) {
            bannerView.pause();
        }
        super.onPause();
    }

    @Override
    public void onDestroy() {
        if (bannerView != null) {
            bannerView.destroy();
            bannerView = null;
        }
        super.onDestroy();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideSystemBars();
        }
    }

    private void hideSystemBars() {
        WindowInsetsControllerCompat controller =
            WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        if (controller == null) {
            return;
        }

        controller.setSystemBarsBehavior(
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        );
        controller.hide(WindowInsetsCompat.Type.systemBars());

        ViewCompat.setOnApplyWindowInsetsListener(getWindow().getDecorView(), (view, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            view.setPadding(0, 0, 0, 0);
            return insets.replaceSystemWindowInsets(
                systemBars.left,
                0,
                systemBars.right,
                0
            );
        });
    }

    private void requestConsentAndLoadAds() {
        setAdDebugStatus(R.string.ad_debug_requesting_consent);
        consentInformation = UserMessagingPlatform.getConsentInformation(this);
        ConsentRequestParameters params = new ConsentRequestParameters.Builder().build();

        consentInformation.requestConsentInfoUpdate(
            this,
            params,
            () -> {
                UserMessagingPlatform.loadAndShowConsentFormIfRequired(
                    this,
                    formError -> {
                        if (consentInformation.canRequestAds()) {
                            initializeAdsIfNeeded();
                            loadBannerIfPossible();
                        } else {
                            setAdDebugStatus(R.string.ad_debug_consent_blocked);
                        }
                    }
                );

                if (consentInformation.canRequestAds()) {
                    initializeAdsIfNeeded();
                    loadBannerIfPossible();
                } else {
                    setAdDebugStatus(R.string.ad_debug_consent_blocked);
                }
            },
            requestConsentError -> {
                if (consentInformation.canRequestAds()) {
                    initializeAdsIfNeeded();
                    loadBannerIfPossible();
                } else {
                    setAdDebugStatus(R.string.ad_debug_consent_blocked);
                }
            }
        );
    }

    private void initializeAdsIfNeeded() {
        if (adsInitialized) {
            return;
        }

        adsInitialized = true;
        MobileAds.initialize(this, initializationStatus -> {});
    }

    private void loadBannerIfPossible() {
        if (adContainer == null || consentInformation == null || !consentInformation.canRequestAds()) {
            setAdDebugStatus(R.string.ad_debug_consent_blocked);
            return;
        }

        if (bannerView != null) {
            return;
        }

        setAdDebugStatus(R.string.ad_debug_loading_banner);
        bannerView = new AdView(this);
        bannerView.setAdUnitId(getString(R.string.admob_banner_ad_unit_id));
        bannerView.setAdSize(getAdaptiveBannerSize());
        bannerView.setAdListener(new AdListener() {
            @Override
            public void onAdLoaded() {
                setAdDebugStatus(R.string.ad_debug_banner_loaded);
            }

            @Override
            public void onAdFailedToLoad(LoadAdError adError) {
                setAdDebugStatus(getString(R.string.ad_debug_banner_failed) + ": " + adError.getCode());
            }
        });

        adContainer.removeAllViews();
        adContainer.addView(
            bannerView,
            new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
        );
        if (adDebugStatus != null) {
            adContainer.addView(
                adDebugStatus,
                new FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                )
            );
        }

        bannerView.loadAd(new AdRequest.Builder().build());
    }

    private void configureWebViewCache() {
        WebView webView = findViewById(R.id.webview);
        if (webView == null) {
            return;
        }

        webView.clearCache(true);
        webView.clearHistory();

        WebSettings settings = webView.getSettings();
        if (settings != null) {
            settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        }
    }

    private AdSize getAdaptiveBannerSize() {
        DisplayMetrics outMetrics = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(outMetrics);

        float density = outMetrics.density;
        float adWidthPixels = adContainer != null && adContainer.getWidth() > 0
            ? adContainer.getWidth()
            : outMetrics.widthPixels;
        int adWidth = (int) (adWidthPixels / density);

        return AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(this, adWidth);
    }

    private void setAdDebugStatus(int stringResId) {
        if (adDebugStatus != null) {
            adDebugStatus.setText(stringResId);
            adDebugStatus.setVisibility(View.VISIBLE);
        }
    }

    private void setAdDebugStatus(String text) {
        if (adDebugStatus != null) {
            adDebugStatus.setText(text);
            adDebugStatus.setVisibility(View.VISIBLE);
        }
    }
}
