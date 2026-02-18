package com.swastik.payload.request;

import com.swastik.model.DoctorStatus;
import com.swastik.utils.ValidEnum;
import jakarta.validation.constraints.*;
import lombok.*;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
public class Doctor implements Serializable {

    @NotBlank
    @Size(max = 15, message = "must be 15 characters or less")
    private String firstName;

    @NotBlank
    @Size(max = 15, message = "must be 15 characters or less")
    private String lastName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String phone;

    @NotBlank
    @Size(max = 200, message = "must be 500 chars or less")
    private String speciality;

    @NotNull(message = "must be provided")
    @Min(value = 0L, message = "must be positive")
    private Integer yearsOfExperience;

    @NotNull(message = "must be provided")
    @ValidEnum(message = "must be valid", enumClass = DoctorStatus.class)
    private String status;
}
