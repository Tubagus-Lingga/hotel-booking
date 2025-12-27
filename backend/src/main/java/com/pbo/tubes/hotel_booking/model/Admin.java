package com.pbo.tubes.hotel_booking.model;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "admin")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long employeeID;

    private String nama;
    private String role;

    @OneToOne
    @JoinColumn(name = "userID")
    private User user;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    private List<Laporan> laporans;

    // Constructors
    public Admin() {
    }

    public Admin(String nama, String role, User user) {
        this.nama = nama;
        this.role = role;
        this.user = user;
    }

    // Getters and Setters
    public Long getEmployeeID() {
        return employeeID;
    }

    public void setEmployeeID(Long employeeID) {
        this.employeeID = employeeID;
    }

    public String getNama() {
        return nama;
    }

    public void setNama(String nama) {
        this.nama = nama;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Laporan> getLaporans() {
        return laporans;
    }

    public void setLaporans(List<Laporan> laporans) {
        this.laporans = laporans;
    }
}
