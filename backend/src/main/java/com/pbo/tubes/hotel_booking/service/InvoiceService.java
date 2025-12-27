package com.pbo.tubes.hotel_booking.service;

import com.pbo.tubes.hotel_booking.model.Booking;
import com.pbo.tubes.hotel_booking.model.Invoice;
import com.pbo.tubes.hotel_booking.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    public Invoice generateInvoice(Booking booking) {
        String invoiceId = "INV" + System.currentTimeMillis();

        // Calculate total days
        long diff = booking.getTanggalCheckOut().getTime() - booking.getTanggalCheckIn().getTime();
        long days = diff / (1000 * 60 * 60 * 24);

        Double totalAmount = booking.getKamar().getHarga() * days;

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        String detail = String.format(
                "Booking ID: %s\nKamar: %s - %s\nCheck-in: %s\nCheck-out: %s\nJumlah Malam: %d\nHarga per Malam: Rp %,.0f\nTotal: Rp %,.0f",
                booking.getBookingID(),
                booking.getKamar().getNomorKamar(),
                booking.getKamar().getTipe(),
                sdf.format(booking.getTanggalCheckIn()),
                sdf.format(booking.getTanggalCheckOut()),
                days,
                booking.getKamar().getHarga(),
                totalAmount);

        Invoice invoice = new Invoice(invoiceId, new Date(), detail);
        invoice.setBooking(booking);

        return invoiceRepository.save(invoice);
    }

    public Optional<Invoice> getInvoiceByBookingId(String bookingId) {
        return invoiceRepository.findByBooking_BookingID(bookingId);
    }
}
