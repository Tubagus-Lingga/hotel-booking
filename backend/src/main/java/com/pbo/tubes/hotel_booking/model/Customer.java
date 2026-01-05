package com.pbo.tubes.hotel_booking.model;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerID;

    private String nama;
    private String email;

    @OneToOne
    @JoinColumn(name = "userID")
    private User user;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Booking> bookings;

    public Customer() {
    }

    public Customer(String nama, String email, User user) {
        this.nama = nama;
        this.email = email;
        this.user = user;
    }

    public Long getCustomerID() {
        return customerID;
    }

    public void setCustomerID(Long customerID) {
        this.customerID = customerID;
    }

    public String getNama() {
        return nama;
    }

    public void setNama(String nama) {
        this.nama = nama;
    }



    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    // Business methods sesuai class diagram
    public void register(Customer customer) {
        // Method untuk registrasi customer baru
        // Implementation akan dilakukan di service layer
        System.out.println("Registering customer: " + customer.getNama());
    }

    public void bookRoom(String nomorKamar, String checkin, String checkout) {
        // Method untuk booking kamar
        // Implementation akan dilakukan di service layer
        System.out.println("Customer " + this.nama + " booking room " + nomorKamar + 
                         " from " + checkin + " to " + checkout);
    }

    public void viewBookingHistory(String customerID) {
        // Method untuk melihat riwayat booking
        // Implementation akan dilakukan di service layer
        System.out.println("Viewing booking history for customer: " + customerID);
    }
}
