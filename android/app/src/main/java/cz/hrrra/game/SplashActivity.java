package cz.hrrra.game;

import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.content.Intent;
import android.os.Bundle;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.view.WindowManager;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.view.animation.OvershootInterpolator;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

public class SplashActivity extends AppCompatActivity {
    private static final long SPLASH_DURATION_MS = 2600L;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private AnimatorSet titleAnimator;
    private final Runnable launchGameRunnable = new Runnable() {
        @Override
        public void run() {
            Intent intent = new Intent(SplashActivity.this, MainActivity.class);
            startActivity(intent);
            finish();
            overridePendingTransition(0, 0);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        configureEdgeToEdgeWindow();
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        hideSystemBars();
        animateTitle();
        handler.postDelayed(launchGameRunnable, SPLASH_DURATION_MS);
    }

    @Override
    protected void onResume() {
        super.onResume();
        hideSystemBars();
    }

    @Override
    protected void onDestroy() {
        handler.removeCallbacks(launchGameRunnable);
        if (titleAnimator != null) {
            titleAnimator.cancel();
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

    private void animateTitle() {
        TextView titleView = findViewById(R.id.splash_title);
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
