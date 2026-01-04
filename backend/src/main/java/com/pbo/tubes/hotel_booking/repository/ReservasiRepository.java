package com.pbo.tubes.hotel_booking.repository;

import com.pbo.tubes.hotel_booking.model.Reservasi;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservasiRepository extends JpaRepository<Reservasi, Long> {

    // cek apakah kamar sudah dipesan di rentang tanggal
    List<Reservasi> findByKamarIdAndCheckOutAfterAndCheckInBefore(
            Long kamarId,
            LocalDate checkIn,
            LocalDate checkOut
    );
}
