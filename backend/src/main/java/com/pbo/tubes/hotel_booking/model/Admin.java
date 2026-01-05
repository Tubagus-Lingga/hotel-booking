package com.pbo.tubes.hotel_booking.model;

import javax.persistence.*;

@Entity
@Table(name = "admins")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String employeeID;
    private String nama;

    @OneToOne
    @JoinColumn(name = "userID")
    private User user;

    public Admin() {
    }

    public Admin(String employeeID, String nama, User user) {
        this.employeeID = employeeID;
        this.nama = nama;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeID() {
        return employeeID;
    }

    public void setEmployeeID(String employeeID) {
        this.employeeID = employeeID;
    }

    public String getNama() {
        return nama;
    }

    public void setNama(String nama) {
        this.nama = nama;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Business methods sesuai class diagram
    public void manageRooms(Kamar kamar) {
        // Method untuk manage kamar (add, update, delete)
        // Implementation akan dilakukan di service layer
        System.out.println("Admin " + this.nama + " managing room: " + kamar.getNomorKamar());
    }

    public void generateReport(String period) {
        // Method untuk generate laporan berdasarkan periode
        // Implementation akan dilakukan di service layer
        System.out.println("Admin " + this.nama + " generating report for period: " + period);
    }
}
