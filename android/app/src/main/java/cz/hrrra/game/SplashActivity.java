package cz.hrrra.game;

import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.WindowManager;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.view.animation.OvershootInterpolator;
import android.widget.TextView;
import android.widget.VideoView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

public class SplashActivity extends AppCompatActivity {
    private static final long POST_VIDEO_SPLASH_DURATION_MS = 2600L;
    private static final long VIDEO_FALLBACK_TIMEOUT_MS = 20000L;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private AnimatorSet titleAnimator;
    private VideoView introVideoView;
    private View splashImageView;
    private TextView titleView;
    private boolean splashArtworkVisible = false;
    private final Runnable launchGameRunnable = new Runnable() {
        @Override
        public void run() {
            Intent intent = new Intent(SplashActivity.this, MainActivity.class);
            startActivity(intent);
            finish();
            overridePendingTransition(0, 0);
        }
    };
    private final Runnable videoFallbackRunnable = new Runnable() {
        @Override
        public void run() {
            revealSplashArtwork();
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        configureEdgeToEdgeWindow();
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        hideSystemBars();

        introVideoView = findViewById(R.id.splash_video);
        splashImageView = findViewById(R.id.splash_image);
        titleView = findViewById(R.id.splash_title);

        if (splashImageView != null) {
            splashImageView.setVisibility(View.GONE);
        }
        if (titleView != null) {
            titleView.setVisibility(View.GONE);
        }

        playIntroVideo();
    }

    @Override
    protected void onResume() {
        super.onResume();
        hideSystemBars();
    }

    @Override
    protected void onDestroy() {
        handler.removeCallbacks(launchGameRunnable);
        handler.removeCallbacks(videoFallbackRunnable);
        if (titleAnimator != null) {
            titleAnimator.cancel();
        }
        if (introVideoView != null) {
            introVideoView.stopPlayback();
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
    }

    private void configureEdgeToEdgeWindow() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams attributes = getWindow().getAttributes();
            attributes.layoutInDisplayCutoutMode =
                WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS;
            getWindow().setAttributes(attributes);
        }
    }

    private void playIntroVideo() {
        if (introVideoView == null) {
            revealSplashArtwork();
            return;
        }

        Uri introVideoUri = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.intro_video);
        introVideoView.setVideoURI(introVideoUri);
        introVideoView.setOnPreparedListener(mediaPlayer -> introVideoView.start());
        introVideoView.setOnCompletionListener(mediaPlayer -> revealSplashArtwork());
        introVideoView.setOnErrorListener((mediaPlayer, what, extra) -> {
            revealSplashArtwork();
            return true;
        });
        introVideoView.requestFocus();
        handler.postDelayed(videoFallbackRunnable, VIDEO_FALLBACK_TIMEOUT_MS);
    }

    private void revealSplashArtwork() {
        if (splashArtworkVisible) {
            return;
        }
        splashArtworkVisible = true;
        handler.removeCallbacks(videoFallbackRunnable);
        if (introVideoView != null) {
            introVideoView.stopPlayback();
            introVideoView.setVisibility(View.GONE);
        }
        if (splashImageView != null) {
            splashImageView.setVisibility(View.VISIBLE);
        }
        if (titleView != null) {
            titleView.setVisibility(View.VISIBLE);
        }
        animateTitle();
        handler.postDelayed(launchGameRunnable, POST_VIDEO_SPLASH_DURATION_MS);
    }

    private void animateTitle() {
        TextView titleView = this.titleView;
        if (titleView == null) {
            return;
        }

        ObjectAnimator fadeIn = ObjectAnimator.ofFloat(titleView, "alpha", 0f, 1f);
        fadeIn.setDuration(320);

        ObjectAnimator scaleX = ObjectAnimator.ofFloat(titleView, "scaleX", 0.18f, 1.7f, 1.35f);
        scaleX.setDuration(700);
        scaleX.setInterpolator(new OvershootInterpolator(1.05f));

        ObjectAnimator scaleY = ObjectAnimator.ofFloat(titleView, "scaleY", 0.18f, 1.7f, 1.35f);
        scaleY.setDuration(700);
        scaleY.setInterpolator(new OvershootInterpolator(1.05f));

        ObjectAnimator rotate = ObjectAnimator.ofFloat(titleView, "rotation", -10f, 2f, 0f);
        rotate.setDuration(700);
        rotate.setInterpolator(new AccelerateDecelerateInterpolator());

        ObjectAnimator explodeScaleX = ObjectAnimator.ofFloat(titleView, "scaleX", 1.35f, 600f);
        explodeScaleX.setStartDelay(1700);
        explodeScaleX.setDuration(1000);
        explodeScaleX.setInterpolator(new AccelerateDecelerateInterpolator());

        ObjectAnimator explodeScaleY = ObjectAnimator.ofFloat(titleView, "scaleY", 1.35f, 600f);
        explodeScaleY.setStartDelay(1700);
        explodeScaleY.setDuration(1000);
        explodeScaleY.setInterpolator(new AccelerateDecelerateInterpolator());

        titleAnimator = new AnimatorSet();
        titleAnimator.playTogether(fadeIn, scaleX, scaleY, rotate, explodeScaleX, explodeScaleY);
        titleAnimator.start();
    }
}
