package com.pbo.tubes.hotel_booking.model;

import javax.persistence.*;

@Entity
@Table(name = "kamar")
public class Kamar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomorKamar;
    private String tipe; // Standard, Executive
    private Double harga;
    private String statusKamar; // Available, Booked, Maintenance

    @Column(columnDefinition = "TEXT")
    private String fasilitasTambahan; // Comma-separated facilities

    @Column(columnDefinition = "TEXT")
    private String gambar; // URL or path to image

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

    public String getStatusKamar() {
        return statusKamar;
    }

    public void setStatusKamar(String statusKamar) {
        this.statusKamar = statusKamar;
    }

    public String getFasilitasTambahan() {
        return fasilitasTambahan;
    }

    public void setFasilitasTambahan(String fasilitasTambahan) {
        this.fasilitasTambahan = fasilitasTambahan;
    }

    public String getGambar() {
        return gambar;
    }

    public void setGambar(String gambar) {
        this.gambar = gambar;
    }
}
