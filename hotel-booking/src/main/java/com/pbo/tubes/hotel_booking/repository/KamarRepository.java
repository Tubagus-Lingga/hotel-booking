package com.pbo.tubes.hotel_booking.repository;

import com.pbo.tubes.hotel_booking.model.Kamar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KamarRepository extends JpaRepository<Kamar, Long> {

    // ✅ UNTUK CEK KETERSEDIAAN
    List<Kamar> findByTersediaTrue();
}
