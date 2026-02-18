package com.hungrycoders.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @RequestMapping("/doctor")
    public ResponseEntity<String> doctorFallback() {
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body("Doctor Service is temporarily unavailable. Please try again later.");
    }

    @RequestMapping("/patient")
    public ResponseEntity<String> patientFallback() {
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body("Patient Service is temporarily unavailable. Please try again later.");
    }

    @RequestMapping("/appointment")
    public ResponseEntity<String> appointmentFallback() {
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body("Appointment Service is temporarily unavailable. Please try again later.");
    }

    @RequestMapping("/auth")
    public ResponseEntity<String> authFallback() {
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body("Authentication Service is temporarily unavailable. Please try again later.");
    }
}