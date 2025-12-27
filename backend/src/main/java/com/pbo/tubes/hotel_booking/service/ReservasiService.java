package com.pbo.tubes.hotel_booking.service;

import com.pbo.tubes.hotel_booking.model.Kamar;
import com.pbo.tubes.hotel_booking.model.Reservasi;
import com.pbo.tubes.hotel_booking.repository.ReservasiRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservasiService {

    private final ReservasiRepository reservasiRepository;
    private final KamarService kamarService;

    public ReservasiService(ReservasiRepository reservasiRepository,
            KamarService kamarService) {
        this.reservasiRepository = reservasiRepository;
        this.kamarService = kamarService;
    }

    public List<Reservasi> getAllReservasi() {
        return reservasiRepository.findAll();
    }

    public boolean kamarTersedia(Long kamarId,
            java.time.LocalDate checkIn,
            java.time.LocalDate checkOut) {

        List<Reservasi> bentrok = reservasiRepository.findByKamarIdAndCheckOutAfterAndCheckInBefore(
                kamarId, checkIn, checkOut);

        return bentrok.isEmpty();
    }

    public void simpanReservasi(Reservasi reservasi) {

        Long kamarId = reservasi.getKamar().getId();

        boolean tersedia = kamarTersedia(
                kamarId,
                reservasi.getCheckIn(),
                reservasi.getCheckOut());

        if (!tersedia) {
            throw new RuntimeException("Kamar tidak tersedia pada tanggal tersebut");
        }

        // Set kamar status to Booked
        Kamar kamar = reservasi.getKamar();
        kamar.setStatusKamar("Booked");
        kamarService.save(kamar);

        // simpan reservasi
        reservasiRepository.save(reservasi);
    }

}
