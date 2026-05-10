package com.dopamine.habitmaker.auth.jwt;

import com.dopamine.habitmaker.domain.user.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT 토큰 발급 및 검증 유틸리티.
 */
@Slf4j
@Component
public class JwtProvider {

    @Value("${jwt.secret}")
    private String secretString;

    @Value("${jwt.access-token-validity}")
    private long accessTokenValidity;

    @Value("${jwt.refresh-token-validity}")
    private long refreshTokenValidity;

    private SecretKey secretKey;

    /** 의존성 주입 끝난 후 SecretKey 초기화 */
    @PostConstruct
    protected void init() {
        this.secretKey = Keys.hmacShaKeyFor(secretString.getBytes(StandardCharsets.UTF_8));
    }

    /** 액세스 토큰 발급 (1시간) */
    public String createAccessToken(Long userId, Role role) {
        return createToken(userId, role, accessTokenValidity);
    }

    /** 리프레시 토큰 발급 (7일) */
    public String createRefreshToken(Long userId, Role role) {
        return createToken(userId, role, refreshTokenValidity);
    }

    private String createToken(Long userId, Role role, long validityMillis) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + validityMillis);

        return Jwts.builder()
                .subject(String.valueOf(userId))            // sub: 사용자 ID
                .claim("role", role.name())                 // 권한
                .issuedAt(now)
                .expiration(expiry)
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    /** 토큰 검증 + Claims 추출. 유효하지 않으면 예외 발생. */
    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /** 토큰 유효성만 체크 (true/false) */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception e) {
            log.debug("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    /** 토큰에서 userId 추출 */
    public Long getUserId(String token) {
        return Long.parseLong(parseClaims(token).getSubject());
    }

    /** 토큰에서 role 추출 */
    public String getRole(String token) {
        return parseClaims(token).get("role", String.class);
    }
}