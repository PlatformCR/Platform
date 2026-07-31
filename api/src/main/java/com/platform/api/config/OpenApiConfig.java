package com.platform.api.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("local")
public class OpenApiConfig {

  @Bean
  OpenAPI platformOpenApi() {
    final String schemeName = "bearerAuth";
    return new OpenAPI()
        .info(new Info()
            .title("Platform API")
            .description("Platform REST API")
            .version("0.0.1"))
        .addSecurityItem(new SecurityRequirement().addList(schemeName))
        .components(new Components()
            .addSecuritySchemes(schemeName, new SecurityScheme()
                .name(schemeName)
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("opaque")));
  }
}
