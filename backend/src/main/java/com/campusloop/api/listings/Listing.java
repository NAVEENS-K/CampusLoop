package com.campusloop.api.listings;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "listings")
public class Listing {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 120)
    private String title;
    @Column(nullable = false, length = 60)
    private String category;
    @Column(nullable = false)
    private Integer priceInPaise;
    @Column(nullable = false, length = 30)
    private String conditionLabel;
    @Column(nullable = false, length = 2000)
    private String description;
    @Column(nullable = false, length = 80)
    private String sellerDisplayName;
    @Column(nullable = false, length = 80)
    private String campusLocation;
    @Column(nullable = false, length = 30)
    private String status = "ACTIVE";
    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Listing() {}
    public Listing(String title, String category, Integer priceInPaise, String conditionLabel,
                   String description, String sellerDisplayName, String campusLocation) {
        this.title = title; this.category = category; this.priceInPaise = priceInPaise;
        this.conditionLabel = conditionLabel; this.description = description;
        this.sellerDisplayName = sellerDisplayName; this.campusLocation = campusLocation;
    }
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getCategory() { return category; }
    public Integer getPriceInPaise() { return priceInPaise; }
    public String getConditionLabel() { return conditionLabel; }
    public String getDescription() { return description; }
    public String getSellerDisplayName() { return sellerDisplayName; }
    public String getCampusLocation() { return campusLocation; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
}