package com.pbo.tubes.hotel_booking.model;

import jakarta.persistence.*;

@Entity
@Table(name = "kamar")
public class Kamar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomorKamar;
    private String tipe;
    private Double harga;
    private Boolean tersedia;

    // ===== GETTER & SETTER =====
    public Long getId() {
        return id;
    }

    // 🔥 INI WAJIB ADA
    public void setId(Long id) {
        this.id = id;
    }

    public String getNomorKamar() {
        return nomorKamar;
    }

    public void setNomorKamar(String nomorKamar) {
        this.nomorKamar = nomorKamar;
    }

    public String getTipe() {
        return tipe;
    }

    public void setTipe(String tipe) {
        this.tipe = tipe;
    }

    public Double getHarga() {
        return harga;
    }

    public void setHarga(Double harga) {
        this.harga = harga;
    }

    public Boolean getTersedia() {
        return tersedia;
    }

    public void setTersedia(Boolean tersedia) {
        this.tersedia = tersedia;
    }
}
