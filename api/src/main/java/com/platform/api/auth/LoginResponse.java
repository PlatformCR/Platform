package com.platform.api.auth;

public record LoginResponse(
    String accessToken,
    UserResponse user
) {
}
