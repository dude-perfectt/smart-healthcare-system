package com.swastik.config;

import com.swastik.filter.AuthenticationFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    private final AuthenticationFilter filter;

    public GatewayConfig(AuthenticationFilter filter) {
        this.filter = filter;
    }

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {

        return builder.routes()

                // Doctor Service
                .route("doctor-service", r -> r.path("/api/v1/doctor/**")
                        .filters(f -> f
                                .filter(filter)
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_FIRST")
//                                .circuitBreaker(c -> c
//                                        .setName("doctorCircuitBreaker")
//                                        .setFallbackUri("forward:/fallback/doctor"))
                        )
                        .uri("http://doctor-service:8080"))

                // Patient Service
                .route("patient-service", r -> r.path("/api/v1/patient/**")
                        .filters(f -> f
                                .filter(filter)
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_FIRST")
//                                .circuitBreaker(c -> c
//                                        .setName("patientCircuitBreaker")
//                                        .setFallbackUri("forward:/fallback/patient"))
                        )
                        .uri("http://patient-service:8080"))

                // Appointment Service
                .route("appointment-service", r -> r.path("/api/v1/appointments/**")
                        .filters(f -> f
                                .filter(filter)
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_FIRST")
//                                .circuitBreaker(c -> c
//                                        .setName("appointmentCircuitBreaker")
//                                        .setFallbackUri("forward:/fallback/appointment"))
                        )
                        .uri("http://appointment-service:8080"))

                // Auth Service (NO auth filter here)
                .route("auth-service", r -> r.path("/api/auth/**")
                        .filters(f -> f
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_FIRST")
//                                .circuitBreaker(c -> c
//                                        .setName("authCircuitBreaker")
//                                        .setFallbackUri("forward:/fallback/auth"))
                        )
                        .uri("http://auth-service:8080"))

                .build();
    }
}
