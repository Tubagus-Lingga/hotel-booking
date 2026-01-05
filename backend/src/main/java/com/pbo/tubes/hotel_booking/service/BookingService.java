package com.pbo.tubes.hotel_booking.service;

import com.pbo.tubes.hotel_booking.dto.BookingRequest;
import com.pbo.tubes.hotel_booking.model.Booking;
import com.pbo.tubes.hotel_booking.model.Customer;
import com.pbo.tubes.hotel_booking.model.Kamar;
import com.pbo.tubes.hotel_booking.model.User;
import com.pbo.tubes.hotel_booking.repository.BookingRepository;
import com.pbo.tubes.hotel_booking.repository.CustomerRepository;
import com.pbo.tubes.hotel_booking.repository.InvoiceRepository;
import com.pbo.tubes.hotel_booking.repository.KamarRepository;
import com.pbo.tubes.hotel_booking.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private KamarRepository kamarRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    public Booking createBooking(Customer customer, Long kamarId, Date checkIn, Date checkOut) {
        Optional<Kamar> kamarOpt = kamarRepository.findById(kamarId);
        if (!kamarOpt.isPresent()) {
            throw new RuntimeException("Kamar tidak ditemukan");
        }

        Kamar kamar = kamarOpt.get();
        if (!"Available".equals(kamar.getStatusKamar())) {
            throw new RuntimeException("Kamar tidak tersedia");
        }

        String bookingId = "BK" + System.currentTimeMillis();

        Booking booking = new Booking(bookingId, checkIn, checkOut, "Pending");
        booking.setCustomer(customer);
        booking.setKamar(kamar);

        kamar.setStatusKamar("Booked");
        kamarRepository.save(kamar);

        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByCustomerId(Long customerId) {
        return bookingRepository.findByCustomer_CustomerID(customerId);
    }

    public Optional<Booking> getBookingById(String bookingId) {
        return bookingRepository.findById(bookingId);
    }

    public Booking updateBookingStatus(String bookingId, String status) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (!bookingOpt.isPresent()) {
            throw new RuntimeException("Booking tidak ditemukan");
        }

        Booking booking = bookingOpt.get();
        booking.setStatusPembayaran(status);
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking assignRoom(String bookingId, Long kamarId) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (!bookingOpt.isPresent()) {
            throw new RuntimeException("Booking tidak ditemukan");
        }

        Optional<Kamar> kamarOpt = kamarRepository.findById(kamarId);
        if (!kamarOpt.isPresent()) {
            throw new RuntimeException("Kamar tidak ditemukan");
        }

        Kamar kamar = kamarOpt.get();
        Booking booking = bookingOpt.get();
        booking.setKamar(kamar);

        if (!"Booked".equals(kamar.getStatusKamar())) {
            kamar.setStatusKamar("Booked");
            kamarRepository.save(kamar);
        }

        return bookingRepository.save(booking);
    }

    @Autowired
    private com.pbo.tubes.hotel_booking.service.CustomerService customerService;

    public Booking createBooking(BookingRequest request, User user) {
        Customer customer = customerRepository.findByUser(user);
        if (customer == null) {
            customer = customerService.createCustomer(user, user.getUsername(), user.getEmail());
        }

        Kamar kamar = kamarRepository.findById(request.getKamarId())
                .orElseThrow(() -> new RuntimeException("Kamar not found"));

        if (!"Available".equals(kamar.getStatusKamar())) {
            throw new RuntimeException("Kamar is not available");
        }

        Booking booking = new Booking();
        booking.setBookingID("B-" + System.currentTimeMillis());
        booking.setCustomer(customer);
        booking.setKamar(kamar);
        booking.setTanggalCheckIn(java.sql.Date.valueOf(request.getCheckIn()));
        booking.setTanggalCheckOut(java.sql.Date.valueOf(request.getCheckOut()));
        booking.setStatusPembayaran("Pending");

        booking.setNamaPemesan(request.getNamaPemesan());

        kamar.setStatusKamar("Booked");
        kamarRepository.save(kamar);

        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByUser(User user) {
        Customer customer = customerRepository.findByUser(user);
        if (customer == null)
            return Collections.emptyList();
        return bookingRepository.findByCustomer(customer);
    }

    public List<Booking> getPendingBookings(User user) {
        List<Booking> bookings = getBookingsByUser(user);
        return bookings.stream()
                .filter(b -> "Pending".equals(b.getStatusPembayaran()))
                .toList();
    }

    public Booking getLatestPendingBooking(User user) {
        List<Booking> pending = getPendingBookings(user);
        if (pending.isEmpty()) return null;
        return pending.get(pending.size() - 1);
    }

    public Booking updateBookingDetails(String bookingId, String nama, String catatan) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setNamaPemesan(nama);
        booking.setCatatan(catatan);

        return bookingRepository.save(booking);
    }

    public Booking processPayment(String bookingId, Double amount, String method) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatusPembayaran("Paid");

        com.pbo.tubes.hotel_booking.model.Payment payment = new com.pbo.tubes.hotel_booking.model.Payment();
        payment.setPaymentID("P-" + System.currentTimeMillis());
        payment.setBooking(booking);
        payment.setTotalPembayaran(amount);
        payment.setMetodePembayaran(method);
        payment.setTanggalPembayaran(new Date());

        booking.setPayment(payment);

        return bookingRepository.save(booking);
    }

    public void processGroupPayment(List<String> bookingIds, Double totalAmount, String method) {
        for (String id : bookingIds) {
             Booking b = bookingRepository.findById(id).orElse(null);
             if (b != null) {
                 b.setStatusPembayaran("Paid");
                 
                 long days = (b.getTanggalCheckOut().getTime() - b.getTanggalCheckIn().getTime()) / (1000 * 3600 * 24);
                 double amount = b.getKamar().getHarga() * days;

                 com.pbo.tubes.hotel_booking.model.Payment payment = new com.pbo.tubes.hotel_booking.model.Payment();
                 payment.setPaymentID("P-" + System.currentTimeMillis() + "-" + id);
                 payment.setBooking(b);
                 payment.setTotalPembayaran(amount);
                 payment.setMetodePembayaran(method);
                 payment.setTanggalPembayaran(new Date());
                 
                 b.setPayment(payment);
                 bookingRepository.save(b);
             }
        }
    }

    public void deleteBooking(String bookingId) {
        if (bookingRepository.existsById(bookingId)) {
            Booking booking = bookingRepository.findById(bookingId).get();
            Kamar kamar = booking.getKamar();
            if (kamar != null) {
                kamar.setStatusKamar("Available");
                kamarRepository.save(kamar);
            }
            bookingRepository.deleteById(bookingId);
        } else {
            throw new RuntimeException("Booking not found");
        }
    }

    public Booking updateBookingDates(String bookingId, String checkInStr, String checkOutStr) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        try {
            java.sql.Date newCheckIn = java.sql.Date.valueOf(checkInStr);
            java.sql.Date newCheckOut = java.sql.Date.valueOf(checkOutStr);

            booking.setTanggalCheckIn(newCheckIn);
            booking.setTanggalCheckOut(newCheckOut);

            if (booking.getPayment() != null && booking.getKamar() != null) {
                long days = (newCheckOut.getTime() - newCheckIn.getTime()) / (1000 * 60 * 60 * 24);
                double newAmount = booking.getKamar().getHarga() * days;
                booking.getPayment().setTotalPembayaran(newAmount);
            }

            return bookingRepository.save(booking);
        } catch (Exception e) {
            throw new RuntimeException("Invalid date format. Use YYYY-MM-DD");
        }
    }

    @Transactional
    public void deleteAllData() {
        invoiceRepository.deleteAll();
        paymentRepository.deleteAll();
        bookingRepository.deleteAll();
        kamarRepository.deleteAll();
    }
}
