package com.pbo.tubes.hotel_booking.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "invoice")
public class Invoice {

    @Id
    private String invoiceID;

    @Temporal(TemporalType.DATE)
    private Date tanggalCetak;

    @Column(columnDefinition = "TEXT")
    private String detailPembayaran;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToOne
    @JoinColumn(name = "bookingID")
    private Booking booking;

    public Invoice() {
    }

    public Invoice(String invoiceID, Date tanggalCetak, String detailPembayaran) {
        this.invoiceID = invoiceID;
        this.tanggalCetak = tanggalCetak;
        this.detailPembayaran = detailPembayaran;
    }

    public String getInvoiceID() {
        return invoiceID;
    }

    public void setInvoiceID(String invoiceID) {
        this.invoiceID = invoiceID;
    }

    public Date getTanggalCetak() {
        return tanggalCetak;
    }

    public void setTanggalCetak(Date tanggalCetak) {
        this.tanggalCetak = tanggalCetak;
    }

    public String getDetailPembayaran() {
        return detailPembayaran;
    }

    public void setDetailPembayaran(String detailPembayaran) {
        this.detailPembayaran = detailPembayaran;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    // Business methods sesuai class diagram
    public void generateInvoice(Booking booking) {
        // Method untuk generate invoice dari booking
        // Implementation akan dilakukan di service layer
        System.out.println("Generating invoice for booking: " + booking.getBookingID());
        this.invoiceID = "INV-" + System.currentTimeMillis();
        this.tanggalCetak = new Date();
        this.booking = booking;
    }

    public void printInvoice(String invoiceID) {
        // Method untuk print invoice
        // Implementation akan dilakukan di service layer
        System.out.println("=== INVOICE ===");
        System.out.println("Invoice ID: " + invoiceID);
        System.out.println("Tanggal Cetak: " + this.tanggalCetak);
        System.out.println("Detail: " + this.detailPembayaran);
        System.out.println("===============");
    }
}
