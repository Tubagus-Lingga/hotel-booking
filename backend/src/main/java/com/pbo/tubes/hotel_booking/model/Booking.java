package com.pbo.tubes.hotel_booking.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "booking")
public class Booking {

    @Id
    private String bookingID;

    @Temporal(TemporalType.DATE)
    private Date tanggalCheckIn;

    @Temporal(TemporalType.DATE)
    private Date tanggalCheckOut;

    private String statusPembayaran;

    @ManyToOne
    @JoinColumn(name = "customerID")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "kamarID")
    private Kamar kamar;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private Payment payment;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private Invoice invoice;

    // Constructors
    public Booking() {
    }

    public Booking(String bookingID, Date tanggalCheckIn, Date tanggalCheckOut, String statusPembayaran) {
        this.bookingID = bookingID;
        this.tanggalCheckIn = tanggalCheckIn;
        this.tanggalCheckOut = tanggalCheckOut;
        this.statusPembayaran = statusPembayaran;
    }

    // Getters and Setters
    public String getBookingID() {
        return bookingID;
    }

    public void setBookingID(String bookingID) {
        this.bookingID = bookingID;
    }

    public Date getTanggalCheckIn() {
        return tanggalCheckIn;
    }

    public void setTanggalCheckIn(Date tanggalCheckIn) {
        this.tanggalCheckIn = tanggalCheckIn;
    }

    public Date getTanggalCheckOut() {
        return tanggalCheckOut;
    }

    public void setTanggalCheckOut(Date tanggalCheckOut) {
        this.tanggalCheckOut = tanggalCheckOut;
    }

    public String getStatusPembayaran() {
        return statusPembayaran;
    }

    public void setStatusPembayaran(String statusPembayaran) {
        this.statusPembayaran = statusPembayaran;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Kamar getKamar() {
        return kamar;
    }

    public void setKamar(Kamar kamar) {
        this.kamar = kamar;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public Invoice getInvoice() {
        return invoice;
    }

    public void setInvoice(Invoice invoice) {
        this.invoice = invoice;
    }
}
