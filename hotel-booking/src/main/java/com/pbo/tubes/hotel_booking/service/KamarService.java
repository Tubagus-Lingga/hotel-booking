package com.pbo.tubes.hotel_booking.service;

import com.pbo.tubes.hotel_booking.model.Kamar;
import com.pbo.tubes.hotel_booking.repository.KamarRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KamarService {

    private final KamarRepository kamarRepository;

    public KamarService(KamarRepository kamarRepository) {
        this.kamarRepository = kamarRepository;
    }

    public List<Kamar> getAllKamar() {
        return kamarRepository.findAll();
    }

    public List<Kamar> getKamarTersedia() {
        return kamarRepository.findByTersediaTrue();
    }

    public Kamar findById(Long id) {
        return kamarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kamar tidak ditemukan"));
    }

    public void save(Kamar kamar) {
        kamarRepository.save(kamar);
    }

    public void delete(Long id) {
        kamarRepository.deleteById(id);
    }
}
