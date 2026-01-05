package com.pbo.tubes.hotel_booking.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "payment")
public class Payment {

    @Id
    private String paymentID;

    @Temporal(TemporalType.DATE)
    private Date tanggalPembayaran;

    private String metodePembayaran;
    private Double totalPembayaran;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToOne
    @JoinColumn(name = "bookingID")
    private Booking booking;

    public Payment() {
    }

    public Payment(String paymentID, Date tanggalPembayaran, String metodePembayaran, Double totalPembayaran) {
        this.paymentID = paymentID;
        this.tanggalPembayaran = tanggalPembayaran;
        this.metodePembayaran = metodePembayaran;
        this.totalPembayaran = totalPembayaran;
    }

    public String getPaymentID() {
        return paymentID;
    }

    public void setPaymentID(String paymentID) {
        this.paymentID = paymentID;
    }

    public Date getTanggalPembayaran() {
        return tanggalPembayaran;
    }

    public void setTanggalPembayaran(Date tanggalPembayaran) {
        this.tanggalPembayaran = tanggalPembayaran;
    }

    public String getMetodePembayaran() {
        return metodePembayaran;
    }

    public void setMetodePembayaran(String metodePembayaran) {
        this.metodePembayaran = metodePembayaran;
    }

    public Double getTotalPembayaran() {
        return totalPembayaran;
    }

    public void setTotalPembayaran(Double totalPembayaran) {
        this.totalPembayaran = totalPembayaran;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    // Business methods sesuai class diagram
    public void processPayment(String paymentID, Payment payment) {
        // Method untuk memproses pembayaran
        // Implementation akan dilakukan di service layer
        System.out.println("Processing payment: " + paymentID);
        System.out.println("Method: " + payment.getMetodePembayaran());
        System.out.println("Total: Rp " + payment.getTotalPembayaran());
    }

    public String getPaymentStatus(String paymentID) {
        // Method untuk mendapatkan status pembayaran
        // Implementation akan dilakukan di service layer
        if (this.booking != null) {
            return this.booking.getStatusPembayaran();
        }
        return "Unknown";
    }
}
