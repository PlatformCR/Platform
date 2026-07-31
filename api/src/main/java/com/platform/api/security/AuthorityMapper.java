package com.platform.api.security;

import com.platform.api.user.Permission;
import com.platform.api.user.Role;
import com.platform.api.user.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public final class AuthorityMapper {

  private AuthorityMapper() {
  }

  public static Collection<GrantedAuthority> toAuthorities(User user) {
    Set<GrantedAuthority> authorities = new LinkedHashSet<>();
    for (Role role : user.getRoles()) {
      authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getCode()));
      for (Permission permission : role.getPermissions()) {
        authorities.add(new SimpleGrantedAuthority(permission.getCode()));
      }
    }
    return authorities;
  }

  public static List<String> roleCodes(User user) {
    return user.getRoles().stream()
        .map(Role::getCode)
        .sorted()
        .collect(Collectors.toList());
  }

  public static List<String> permissionCodes(User user) {
    return user.getRoles().stream()
        .flatMap(role -> role.getPermissions().stream())
        .map(Permission::getCode)
        .distinct()
        .sorted()
        .collect(Collectors.toList());
  }
}
