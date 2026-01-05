package com.pbo.tubes.hotel_booking.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "laporan")
public class Laporan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reportID;
    private String reportType;
    private Date reportDate;

    @ManyToOne
    @JoinColumn(name = "adminID")
    private Admin admin;

    public Laporan() {
    }

    public Laporan(String reportID, String reportType, Date reportDate, Admin admin) {
        this.reportID = reportID;
        this.reportType = reportType;
        this.reportDate = reportDate;
        this.admin = admin;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReportID() {
        return reportID;
    }

    public void setReportID(String reportID) {
        this.reportID = reportID;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public Date getReportDate() {
        return reportDate;
    }

    public void setReportDate(Date reportDate) {
        this.reportDate = reportDate;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    // Business methods sesuai class diagram
    public void generateReport(String period) {
        // Method untuk generate laporan berdasarkan periode
        System.out.println("Generating report " + this.reportID + " for period: " + period);
        // Logic untuk generate report akan diimplementasikan di service layer
    }

    public void displayReport(String reportID) {
        // Method untuk menampilkan laporan berdasarkan reportID
        System.out.println("Displaying report: " + reportID);
        System.out.println("Report Type: " + this.reportType);
        System.out.println("Report Date: " + this.reportDate);
        // Logic untuk display report akan diimplementasikan di service layer
    }
}
