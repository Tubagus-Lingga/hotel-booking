package com.pbo.tubes.hotel_booking.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "laporan")
public class Laporan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportID;

    private String reportType;

    @Temporal(TemporalType.DATE)
    private Date reportDate;

    @ManyToOne
    @JoinColumn(name = "employeeID")
    private Admin admin;

    // Constructors
    public Laporan() {
    }

    public Laporan(String reportType, Date reportDate, Admin admin) {
        this.reportType = reportType;
        this.reportDate = reportDate;
        this.admin = admin;
    }

    // Getters and Setters
    public Long getReportID() {
        return reportID;
    }

    public void setReportID(Long reportID) {
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
}
