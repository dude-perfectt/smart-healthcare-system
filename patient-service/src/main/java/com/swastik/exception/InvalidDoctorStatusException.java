package com.swastik.exception;

public class InvalidDoctorStatusException extends RuntimeException {
    public InvalidDoctorStatusException(String message) {
        super(message);
    }
}
