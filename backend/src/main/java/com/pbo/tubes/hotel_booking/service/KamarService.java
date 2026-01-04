package com.pbo.tubes.hotel_booking.service;

import com.pbo.tubes.hotel_booking.model.Kamar;
import com.pbo.tubes.hotel_booking.repository.BookingRepository;
import com.pbo.tubes.hotel_booking.repository.KamarRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KamarService {

    private final KamarRepository kamarRepository;
    private final BookingRepository bookingRepository;

    public KamarService(KamarRepository kamarRepository, BookingRepository bookingRepository) {
        this.kamarRepository = kamarRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<Kamar> getAllKamar() {
        return kamarRepository.findAll();
    }

    public List<Kamar> getKamarTersedia() {
        return kamarRepository.findByStatusKamar("Available");
    }

    public Kamar findById(Long id) {
        return kamarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kamar tidak ditemukan"));
    }

    public void save(Kamar kamar) {
        kamarRepository.save(kamar);
    }

    public void delete(Long id) {
        if (!bookingRepository.findByKamar_Id(id).isEmpty()) {
            throw new RuntimeException("Kamar tidak bisa dihapus karena masih memiliki riwayat pemesanan (booking).");
        }
        kamarRepository.deleteById(id);
    }
}
