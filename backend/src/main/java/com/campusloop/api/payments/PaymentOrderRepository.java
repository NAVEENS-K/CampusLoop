package com.campusloop.api.payments;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {
    Optional<PaymentOrder> findByProviderOrderId(String providerOrderId);
}
