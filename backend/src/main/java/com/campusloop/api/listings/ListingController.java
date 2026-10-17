package com.campusloop.api.listings;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/listings")
public class ListingController {
    private final ListingRepository repository;
    public ListingController(ListingRepository repository) { this.repository = repository; }

    @GetMapping
    public List<Listing> getActiveListings() {
        return repository.findByStatusOrderByCreatedAtDesc("ACTIVE");
    }

    @GetMapping("/{id}")
    public Listing getListing(@PathVariable Long id) {
        return repository.findById(id)
            .filter(item -> "ACTIVE".equals(item.getStatus()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Listing not found"));
    }
}