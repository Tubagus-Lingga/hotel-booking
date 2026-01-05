package com.pbo.tubes.hotel_booking.model;

import javax.persistence.*;

@Entity
@Table(name = "kamar")
public class Kamar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomorKamar;
    private String tipe; 
    private Double harga;
    private String statusKamar; 

    @Column(columnDefinition = "TEXT")
    private String fasilitasTambahan; 

    @Column(columnDefinition = "TEXT")
    private String gambar;

    public Long getId() {
        return id;
    }

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

    // Business methods sesuai class diagram
    public String getDetailKamar() {
        // Method untuk mendapatkan detail lengkap kamar
        StringBuilder detail = new StringBuilder();
        detail.append("Kamar ").append(this.nomorKamar).append("\n");
        detail.append("Tipe: ").append(this.tipe).append("\n");
        detail.append("Harga: Rp ").append(this.harga).append("/malam\n");
        detail.append("Status: ").append(this.statusKamar).append("\n");
        detail.append("Fasilitas: ").append(this.fasilitasTambahan);
        return detail.toString();
    }

    public Boolean isAvailable() {
        // Method untuk cek apakah kamar tersedia
        return "Available".equalsIgnoreCase(this.statusKamar);
    }
}
