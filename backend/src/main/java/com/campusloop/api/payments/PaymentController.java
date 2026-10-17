package com.campusloop.api.payments;

import com.campusloop.api.listings.Listing;
import com.campusloop.api.listings.ListingRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.client.RestClient;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final ListingRepository listings;
    private final PaymentOrderRepository orders;
    private final RestClient razorpay = RestClient.create();
    private final String keyId;
    private final String keySecret;

    public PaymentController(ListingRepository listings, PaymentOrderRepository orders,
            @Value("${RAZORPAY_KEY_ID:}") String keyId,
            @Value("${RAZORPAY_KEY_SECRET:}") String keySecret) {
        this.listings = listings;
        this.orders = orders;
        this.keyId = keyId;
        this.keySecret = keySecret;
    }

    public record CreateOrderRequest(@NotNull Long listingId) {}
    public record VerifyPaymentRequest(@NotBlank String razorpayOrderId,
            @NotBlank String razorpayPaymentId, @NotBlank String razorpaySignature) {}
    public record CheckoutOrder(String keyId, String orderId, int amount, String currency,
            String listingTitle, String description) {}
    public record VerificationResult(boolean verified, String status, String message) {}

    @PostMapping("/orders")
    @ResponseStatus(HttpStatus.CREATED)
    public CheckoutOrder createOrder(@Valid @RequestBody CreateOrderRequest request) {
        requireConfigured();
        Listing listing = listings.findById(request.listingId())
                .filter(item -> "ACTIVE".equals(item.getStatus()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Active listing not found"));
        if (listing.getPriceInPaise() == null || listing.getPriceInPaise() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Listing price is invalid");
        }

        Map<?, ?> providerOrder;
        try {
            providerOrder = razorpay.post()
                    .uri("https://api.razorpay.com/v1/orders")
                    .headers(headers -> headers.setBasicAuth(keyId, keySecret))
                    .body(Map.of(
                            "amount", listing.getPriceInPaise(),
                            "currency", "INR",
                            "receipt", "cl-" + listing.getId() + "-" + System.currentTimeMillis(),
                            "notes", Map.of("listingId", String.valueOf(listing.getId()), "app", "CampusLoop")))
                    .retrieve().body(Map.class);
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Payment provider could not create an order. Please retry.", exception);
        }
        if (providerOrder == null || providerOrder.get("id") == null) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Payment provider returned an invalid order");
        }
        String orderId = String.valueOf(providerOrder.get("id"));
        orders.save(new PaymentOrder(orderId, listing.getId(), listing.getPriceInPaise()));
        return new CheckoutOrder(keyId, orderId, listing.getPriceInPaise(), "INR",
                listing.getTitle(), "CampusLoop marketplace purchase");
    }

    @PostMapping("/verify")
    public VerificationResult verify(@Valid @RequestBody VerifyPaymentRequest request) {
        requireConfigured();
        PaymentOrder order = orders.findByProviderOrderId(request.razorpayOrderId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment order not found"));
        if ("PAYMENT_SIGNATURE_VERIFIED".equals(order.getStatus())) {
            return new VerificationResult(true, order.getStatus(), "Payment signature was already verified");
        }
        String expected = hmacSha256(request.razorpayOrderId() + "|" + request.razorpayPaymentId(), keySecret);
        if (!MessageDigest.isEqual(expected.getBytes(StandardCharsets.UTF_8),
                request.razorpaySignature().getBytes(StandardCharsets.UTF_8))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment signature is invalid");
        }
        order.markVerified();
        orders.save(order);
        return new VerificationResult(true, order.getStatus(),
                "Provider signature verified. Final settlement status must be confirmed by a signed webhook.");
    }

    private void requireConfigured() {
        if (keyId.isBlank() || keySecret.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Online payments are not configured. Add Razorpay test credentials to the backend environment.");
        }
    }

    private static String hmacSha256(String payload, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return HexFormat.of().formatHex(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Could not verify payment signature", exception);
        }
    }
}
