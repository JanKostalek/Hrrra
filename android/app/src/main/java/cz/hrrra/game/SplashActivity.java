package cz.hrrra.game;

import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.content.Intent;
import android.view.Gravity;
import android.graphics.SurfaceTexture;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Surface;
import android.view.TextureView;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.view.animation.OvershootInterpolator;
import android.widget.FrameLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import java.io.IOException;

public class SplashActivity extends AppCompatActivity {
    private static final long TITLE_HOLD_DURATION_MS = 1000L;
    private static final long TITLE_GROW_DURATION_MS = 1000L;
    private static final long VIDEO_FALLBACK_TIMEOUT_MS = 20000L;

    private final Handler handler = new Handler(Looper.getMainLooper());
    private AnimatorSet titleAnimator;
    private TextureView introVideoView;
    private MediaPlayer introMediaPlayer;
    private Surface introVideoSurface;
    private View splashImageView;
    private TextView titleView;
    private boolean splashArtworkVisible = false;
    private boolean introVideoStarted = false;
    private int introVideoWidth = 0;
    private int introVideoHeight = 0;

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

        if (introVideoView != null) {
            introVideoView.setSurfaceTextureListener(surfaceTextureListener);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        hideSystemBars();
        if (introVideoView != null && introVideoView.isAvailable() && !introVideoStarted) {
            playIntroVideo();
        }
    }

    @Override
    protected void onDestroy() {
        handler.removeCallbacks(launchGameRunnable);
        handler.removeCallbacks(videoFallbackRunnable);
        if (titleAnimator != null) {
            titleAnimator.cancel();
        }
        releaseIntroVideo();
        super.onDestroy();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideSystemBars();
        }
    }

    private final TextureView.SurfaceTextureListener surfaceTextureListener =
        new TextureView.SurfaceTextureListener() {
            @Override
            public void onSurfaceTextureAvailable(SurfaceTexture surfaceTexture, int width, int height) {
                playIntroVideo();
            }

            @Override
            public void onSurfaceTextureSizeChanged(SurfaceTexture surfaceTexture, int width, int height) {
                applyVideoStretch();
            }

            @Override
            public boolean onSurfaceTextureDestroyed(SurfaceTexture surfaceTexture) {
                releaseIntroVideo();
                return true;
            }

            @Override
            public void onSurfaceTextureUpdated(SurfaceTexture surfaceTexture) {
                // No-op.
            }
        };

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
        if (introVideoStarted || introVideoView == null || !introVideoView.isAvailable()) {
            return;
        }

        introVideoStarted = true;
        handler.postDelayed(videoFallbackRunnable, VIDEO_FALLBACK_TIMEOUT_MS);

        try {
            SurfaceTexture surfaceTexture = introVideoView.getSurfaceTexture();
            if (surfaceTexture == null) {
                revealSplashArtwork();
                return;
            }

            introVideoSurface = new Surface(surfaceTexture);
            introMediaPlayer = new MediaPlayer();
            introMediaPlayer.setAudioAttributes(
                new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MOVIE)
                    .build()
            );
            introMediaPlayer.setSurface(introVideoSurface);
            introMediaPlayer.setOnPreparedListener(mediaPlayer -> {
                introVideoWidth = mediaPlayer.getVideoWidth();
                introVideoHeight = mediaPlayer.getVideoHeight();
                applyVideoStretch();
                mediaPlayer.start();
            });
            introMediaPlayer.setOnVideoSizeChangedListener((mediaPlayer, width, height) -> {
                introVideoWidth = width;
                introVideoHeight = height;
                applyVideoStretch();
            });
            introMediaPlayer.setOnCompletionListener(mediaPlayer -> revealSplashArtwork());
            introMediaPlayer.setOnErrorListener((mediaPlayer, what, extra) -> {
                revealSplashArtwork();
                return true;
            });
            introMediaPlayer.setDataSource(
                this,
                Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.intro_video)
            );
            introMediaPlayer.prepareAsync();
        } catch (IOException | IllegalStateException error) {
            revealSplashArtwork();
        }
    }

    private void applyVideoStretch() {
        if (introVideoView == null || introVideoWidth <= 0 || introVideoHeight <= 0) {
            return;
        }

        SurfaceTexture surfaceTexture = introVideoView.getSurfaceTexture();
        if (surfaceTexture != null) {
            surfaceTexture.setDefaultBufferSize(introVideoWidth, introVideoHeight);
        }

        ViewGroup.LayoutParams params = introVideoView.getLayoutParams();
        if (params != null) {
            params.width = ViewGroup.LayoutParams.MATCH_PARENT;
            params.height = ViewGroup.LayoutParams.MATCH_PARENT;
            if (params instanceof FrameLayout.LayoutParams) {
                ((FrameLayout.LayoutParams) params).gravity = Gravity.CENTER;
            }
            introVideoView.setLayoutParams(params);
            introVideoView.setScaleX(1f);
            introVideoView.setScaleY(1f);
        }
    }

    private void releaseIntroVideo() {
        handler.removeCallbacks(videoFallbackRunnable);
        if (introMediaPlayer != null) {
            try {
                introMediaPlayer.stop();
            } catch (IllegalStateException ignored) {
                // Player may already be stopped or not started yet.
            }
            introMediaPlayer.release();
            introMediaPlayer = null;
        }
        if (introVideoSurface != null) {
            introVideoSurface.release();
            introVideoSurface = null;
        }
    }

    private void revealSplashArtwork() {
        if (splashArtworkVisible) {
            return;
        }
        splashArtworkVisible = true;
        handler.removeCallbacks(videoFallbackRunnable);
        releaseIntroVideo();

        if (introVideoView != null) {
            introVideoView.setVisibility(View.GONE);
        }
        if (splashImageView != null) {
            splashImageView.setVisibility(View.VISIBLE);
        }
        if (titleView != null) {
            titleView.setVisibility(View.VISIBLE);
        }
        animateTitle();
    }

    private void animateTitle() {
        TextView titleView = this.titleView;
        if (titleView == null) {
            return;
        }

        titleView.setAlpha(0f);
        titleView.setScaleX(0.18f);
        titleView.setScaleY(0.18f);
        titleView.setRotation(-10f);

        ObjectAnimator fadeIn = ObjectAnimator.ofFloat(titleView, "alpha", 0f, 1f);
        fadeIn.setDuration(320);

        ObjectAnimator scaleX = ObjectAnimator.ofFloat(titleView, "scaleX", 0.18f, 1.8f);
        scaleX.setStartDelay(TITLE_HOLD_DURATION_MS);
        scaleX.setDuration(TITLE_GROW_DURATION_MS);
        scaleX.setInterpolator(new OvershootInterpolator(1.0f));

        ObjectAnimator scaleY = ObjectAnimator.ofFloat(titleView, "scaleY", 0.18f, 1.8f);
        scaleY.setStartDelay(TITLE_HOLD_DURATION_MS);
        scaleY.setDuration(TITLE_GROW_DURATION_MS);
        scaleY.setInterpolator(new OvershootInterpolator(1.0f));

        ObjectAnimator rotate = ObjectAnimator.ofFloat(titleView, "rotation", -10f, 0f);
        rotate.setStartDelay(TITLE_HOLD_DURATION_MS);
        rotate.setDuration(TITLE_GROW_DURATION_MS);
        rotate.setInterpolator(new AccelerateDecelerateInterpolator());

        titleAnimator = new AnimatorSet();
        titleAnimator.playTogether(fadeIn, scaleX, scaleY, rotate);
        titleAnimator.addListener(new android.animation.AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(android.animation.Animator animation) {
                handler.post(launchGameRunnable);
            }
        });
        titleAnimator.start();
    }
}
