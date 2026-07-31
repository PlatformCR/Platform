package com.platform.api.auth;

import java.util.List;

public record UserResponse(
    String personalId,
    String email,
    String displayName,
    String avatarUrl,
    List<String> roles,
    List<String> permissions
) {
}
