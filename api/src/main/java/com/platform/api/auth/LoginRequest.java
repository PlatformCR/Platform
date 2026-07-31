package com.platform.api.auth;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank String personalId,
    @NotBlank String password
) {
}
