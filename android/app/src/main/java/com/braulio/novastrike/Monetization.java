package com.braulio.novastrike;

import android.app.Activity;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import androidx.annotation.NonNull;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ConsumeParams;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Puente entre el juego (JavaScript) y Android para anuncios (AdMob) y compras (Google Play Billing).
 * El juego llama a window.NSNative.* y recibe respuestas en window.onNative(evento, datos).
 */
public class Monetization {
    /** Productos de la tienda. Deben crearse con estos mismos IDs en Google Play Console. */
    static final List<String> CONSUMABLES = Arrays.asList("coins_small", "coins_medium", "coins_large");
    static final List<String> PERMANENT = Arrays.asList("remove_ads", "starter_pack");

    private final Activity act;
    private final WebView web;
    private RewardedAd rewarded;
    private InterstitialAd interstitial;
    private BillingClient billing;
    private final Map<String, ProductDetails> products = new HashMap<>();
    private String rewardTag = "";
    private boolean rewardEarned = false;

    Monetization(Activity act, WebView web) {
        this.act = act;
        this.web = web;
        MobileAds.initialize(act, status -> { loadRewarded(); loadInterstitial(); });
        setupBilling();
    }

    private void emit(String event, String data) {
        final String js = "window.onNative && window.onNative(" + JSONObject.quote(event) + "," + JSONObject.quote(data) + ")";
        act.runOnUiThread(() -> web.evaluateJavascript(js, null));
    }

    /* ---------------- Anuncios ---------------- */
    private void loadRewarded() {
        RewardedAd.load(act, act.getString(R.string.ad_rewarded), new AdRequest.Builder().build(), new RewardedAdLoadCallback() {
            @Override public void onAdLoaded(@NonNull RewardedAd ad) { rewarded = ad; emit("adReady", "rewarded"); }
            @Override public void onAdFailedToLoad(@NonNull LoadAdError e) { rewarded = null; }
        });
    }

    private void loadInterstitial() {
        InterstitialAd.load(act, act.getString(R.string.ad_interstitial), new AdRequest.Builder().build(), new InterstitialAdLoadCallback() {
            @Override public void onAdLoaded(@NonNull InterstitialAd ad) { interstitial = ad; }
            @Override public void onAdFailedToLoad(@NonNull LoadAdError e) { interstitial = null; }
        });
    }

    @JavascriptInterface public boolean available() { return true; }
    @JavascriptInterface public boolean rewardedReady() { return rewarded != null; }

    @JavascriptInterface
    public void showRewarded(String tag) {
        act.runOnUiThread(() -> {
            if (rewarded == null) { emit("rewardFail", tag); loadRewarded(); return; }
            rewardTag = tag; rewardEarned = false;
            rewarded.setFullScreenContentCallback(new FullScreenContentCallback() {
                @Override public void onAdDismissedFullScreenContent() {
                    emit(rewardEarned ? "reward" : "rewardFail", rewardTag); rewarded = null; loadRewarded();
                }
                @Override public void onAdFailedToShowFullScreenContent(@NonNull AdError e) { emit("rewardFail", rewardTag); rewarded = null; loadRewarded(); }
            });
            rewarded.show(act, item -> rewardEarned = true);
        });
    }

    @JavascriptInterface
    public void showInterstitial() {
        act.runOnUiThread(() -> {
            if (interstitial == null) { loadInterstitial(); return; }
            interstitial.setFullScreenContentCallback(new FullScreenContentCallback() {
                @Override public void onAdDismissedFullScreenContent() { interstitial = null; loadInterstitial(); emit("interstitialClosed", ""); }
            });
            interstitial.show(act);
        });
    }

    /* ---------------- Compras ---------------- */
    private void setupBilling() {
        billing = BillingClient.newBuilder(act)
            .setListener((result, purchases) -> {
                if (result.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
                    for (Purchase p : purchases) handlePurchase(p);
                } else if (result.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
                    emit("purchaseCancel", "");
                } else {
                    emit("purchaseFail", result.getDebugMessage());
                }
            })
            .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
            .build();
        connectBilling();
    }

    private void connectBilling() {
        billing.startConnection(new BillingClientStateListener() {
            @Override public void onBillingSetupFinished(@NonNull BillingResult r) {
                if (r.getResponseCode() != BillingClient.BillingResponseCode.OK) return;
                queryProducts();
                restore();
            }
            @Override public void onBillingServiceDisconnected() { }
        });
    }

    private void queryProducts() {
        List<QueryProductDetailsParams.Product> list = new ArrayList<>();
        List<String> all = new ArrayList<>(CONSUMABLES); all.addAll(PERMANENT);
        for (String id : all) list.add(QueryProductDetailsParams.Product.newBuilder().setProductId(id).setProductType(BillingClient.ProductType.INAPP).build());
        billing.queryProductDetailsAsync(QueryProductDetailsParams.newBuilder().setProductList(list).build(), (r, details) -> {
            JSONObject prices = new JSONObject();
            for (ProductDetails d : details) {
                products.put(d.getProductId(), d);
                try { prices.put(d.getProductId(), d.getOneTimePurchaseOfferDetails().getFormattedPrice()); } catch (Exception ignored) { }
            }
            emit("prices", prices.toString());
        });
    }

    private void restore() {
        billing.queryPurchasesAsync(QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build(), (r, purchases) -> {
            for (Purchase p : purchases) handlePurchase(p);
        });
    }

    @JavascriptInterface
    public void buy(String productId) {
        act.runOnUiThread(() -> {
            ProductDetails d = products.get(productId);
            if (d == null) { emit("purchaseFail", "Producto no disponible"); return; }
            BillingFlowParams.ProductDetailsParams pp = BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(d).build();
            billing.launchBillingFlow(act, BillingFlowParams.newBuilder().setProductDetailsParamsList(Arrays.asList(pp)).build());
        });
    }

    private void handlePurchase(Purchase p) {
        if (p.getPurchaseState() != Purchase.PurchaseState.PURCHASED) return;
        for (String id : p.getProducts()) {
            if (CONSUMABLES.contains(id)) {
                billing.consumeAsync(ConsumeParams.newBuilder().setPurchaseToken(p.getPurchaseToken()).build(), (r, token) -> {
                    if (r.getResponseCode() == BillingClient.BillingResponseCode.OK) emit("purchase", id);
                });
            } else {
                emit("owned", id);
                if (!p.isAcknowledged()) {
                    billing.acknowledgePurchase(AcknowledgePurchaseParams.newBuilder().setPurchaseToken(p.getPurchaseToken()).build(), r -> { });
                }
            }
        }
    }
}
