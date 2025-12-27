package com.pbo.tubes.hotel_booking.dto;

import java.time.LocalDate;

public class BookingRequest {
    private Long kamarId;
    private String namaPemesan;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String tipeKasur;
    private boolean sarapan;

    // Getters and Setters
    public Long getKamarId() {
        return kamarId;
    }

    public void setKamarId(Long kamarId) {
        this.kamarId = kamarId;
    }

    public String getNamaPemesan() {
        return namaPemesan;
    }

    public void setNamaPemesan(String namaPemesan) {
        this.namaPemesan = namaPemesan;
    }

    public LocalDate getCheckIn() {
        return checkIn;
    }

    public void setCheckIn(LocalDate checkIn) {
        this.checkIn = checkIn;
    }

    public LocalDate getCheckOut() {
        return checkOut;
    }

    public void setCheckOut(LocalDate checkOut) {
        this.checkOut = checkOut;
    }

    public String getTipeKasur() {
        return tipeKasur;
    }

    public void setTipeKasur(String tipeKasur) {
        this.tipeKasur = tipeKasur;
    }

    public boolean isSarapan() {
        return sarapan;
    }

    public void setSarapan(boolean sarapan) {
        this.sarapan = sarapan;
    }
}
