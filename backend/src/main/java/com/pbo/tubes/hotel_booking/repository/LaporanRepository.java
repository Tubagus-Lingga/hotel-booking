package com.pbo.tubes.hotel_booking.repository;

import com.pbo.tubes.hotel_booking.model.Laporan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LaporanRepository extends JpaRepository<Laporan, Long> {
    List<Laporan> findByAdmin_EmployeeID(Long employeeId);
}
