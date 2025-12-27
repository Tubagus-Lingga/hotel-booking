package com.pbo.tubes.hotel_booking.service;

import com.pbo.tubes.hotel_booking.model.Customer;
import com.pbo.tubes.hotel_booking.model.User;
import com.pbo.tubes.hotel_booking.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public Customer createCustomer(User user, String nama, String alamat, String telepon, String email) {
        Customer customer = new Customer(nama, alamat, telepon, email, user);
        return customerRepository.save(customer);
    }

    public Optional<Customer> getCustomerByUserId(Long userId) {
        return customerRepository.findByUser_Id(userId);
    }

    public Optional<Customer> getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    public Customer updateCustomer(Customer customer) {
        return customerRepository.save(customer);
    }
}
