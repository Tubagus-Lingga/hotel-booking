package com.pbo.tubes.hotel_booking.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reservasi")
public class Reservasi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String namaPemesan;

    private LocalDate checkIn;
    private LocalDate checkOut;

    @ManyToOne
    @JoinColumn(name = "kamar_id")
    private Kamar kamar;

    // ===== getter & setter =====
    public Long getId() { return id; }

    public String getNamaPemesan() { return namaPemesan; }
    public void setNamaPemesan(String namaPemesan) { this.namaPemesan = namaPemesan; }

    public LocalDate getCheckIn() { return checkIn; }
    public void setCheckIn(LocalDate checkIn) { this.checkIn = checkIn; }

    public LocalDate getCheckOut() { return checkOut; }
    public void setCheckOut(LocalDate checkOut) { this.checkOut = checkOut; }

    public Kamar getKamar() { return kamar; }
    public void setKamar(Kamar kamar) { this.kamar = kamar; }
}
