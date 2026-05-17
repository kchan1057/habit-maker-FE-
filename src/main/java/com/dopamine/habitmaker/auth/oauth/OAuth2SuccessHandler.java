package com.dopamine.habitmaker.auth.oauth;

import com.dopamine.habitmaker.auth.JwtProvider;
import com.dopamine.habitmaker.user.domain.Role;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;
    private static final String REDIRECT_URL = "http://localhost:3000/oauth/callback";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        Long userId = oAuth2User.getUserId();
        Role role = oAuth2User.getRole();

        log.info("OAuth2 login success: userId={}", userId);

        // TODO: 진짜 JWT 발급 (지금은 임시 문자열)
        String accessToken = jwtProvider.createAccessToken(userId, role);
        String refreshToken = jwtProvider.createRefreshToken(userId, role);

        // 프론트엔드로 리다이렉트하면서 토큰을 쿼리 파라미터로 전달
        String targetUrl = UriComponentsBuilder.fromUriString(REDIRECT_URL)
                .queryParam("accessToken", accessToken)
                .queryParam("refreshToken", refreshToken)
                .build()
                .toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}