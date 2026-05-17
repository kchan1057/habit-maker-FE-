package com.dopamine.habitmaker.config;

import com.dopamine.habitmaker.auth.JwtAuthFilter;
import com.dopamine.habitmaker.auth.oauth.CustomOAuth2UserService;
import com.dopamine.habitmaker.auth.oauth.OAuth2SuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 비활성화 (REST API + JWT 쓰니까)
                .csrf(csrf -> csrf.disable())

                // 세션 사용 안함 (JWT 사용)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 기본 로그인 화면 비활성화
                .formLogin(f -> f.disable())
                .httpBasic(h -> h.disable())

                // URL별 권한 설정
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/error",
                                "/oauth2/**",
                                "/login/**",
                                "/api/auth/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )

                // 카카오 OAuth2 로그인 설정
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(u -> u.userService(customOAuth2UserService))
                        .successHandler(oAuth2SuccessHandler)
                )

                // JWT 필터를 Spring 기본 인증 필터 앞에 추가
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}