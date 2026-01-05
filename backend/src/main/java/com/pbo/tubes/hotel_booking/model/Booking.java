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
    private String namaPemesan;

    private String catatan;

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

    public String getNamaPemesan() {
        return namaPemesan;
    }

    public void setNamaPemesan(String namaPemesan) {
        this.namaPemesan = namaPemesan;
    }



    public String getCatatan() {
        return catatan;
    }

    public void setCatatan(String catatan) {
        this.catatan = catatan;
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

    // Business methods sesuai class diagram
    public Double calculateTotal(String nomorKamar, int nights) {
        // Method untuk menghitung total harga booking
        // Implementation akan dilakukan di service layer
        if (this.kamar != null) {
            Double total = this.kamar.getHarga() * nights;
            System.out.println("Total for " + nights + " nights: Rp " + total);
            return total;
        }
        return 0.0;
    }

    public void confirmBooking(String bookingID) {
        // Method untuk konfirmasi booking
        // Implementation akan dilakukan di service layer
        System.out.println("Confirming booking: " + bookingID);
        this.statusPembayaran = "Confirmed";
    }

    public void cancelBooking(String bookingID) {
        // Method untuk cancel booking
        // Implementation akan dilakukan di service layer
        System.out.println("Cancelling booking: " + bookingID);
        this.statusPembayaran = "Cancelled";
    }
}
