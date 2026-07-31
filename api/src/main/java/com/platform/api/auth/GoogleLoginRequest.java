package com.platform.api.auth;

import jakarta.validation.constraints.NotBlank;

public record GoogleLoginRequest(
    @NotBlank String idToken
) {
}
