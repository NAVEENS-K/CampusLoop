package com.campusloop.api.payments;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "payment_orders")
public class PaymentOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, length = 80)
    private String providerOrderId;
    @Column(nullable = false)
    private Long listingId;
    @Column(nullable = false)
    private Integer amountPaise;
    @Column(nullable = false, length = 30)
    private String status = "CREATED";
    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
    private Instant verifiedAt;

    protected PaymentOrder() {}
    public PaymentOrder(String providerOrderId, Long listingId, Integer amountPaise) {
        this.providerOrderId = providerOrderId;
        this.listingId = listingId;
        this.amountPaise = amountPaise;
    }
    public Long getId() { return id; }
    public String getProviderOrderId() { return providerOrderId; }
    public Long getListingId() { return listingId; }
    public Integer getAmountPaise() { return amountPaise; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getVerifiedAt() { return verifiedAt; }
    public void markVerified() { this.status = "PAYMENT_SIGNATURE_VERIFIED"; this.verifiedAt = Instant.now(); }
}