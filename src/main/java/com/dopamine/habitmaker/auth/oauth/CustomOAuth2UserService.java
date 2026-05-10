package com.dopamine.habitmaker.auth.oauth;

import com.dopamine.habitmaker.domain.user.User;
import com.dopamine.habitmaker.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 1. 카카오에서 사용자 정보 받기 (Spring Security가 알아서 처리)
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        log.info("Kakao response: {}", attributes);

        // 2. 카카오 응답에서 필요한 정보 꺼내기
        Long kakaoId = ((Number) attributes.get("id")).longValue();

        // kakao_account.profile.nickname 경로로 닉네임 추출
        String nickname = extractNickname(attributes);
        String profileImage = extractProfileImage(attributes);

        // 3. DB에 저장 (신규) 또는 업데이트 (기존)
        User user = userRepository.findByKakaoId(kakaoId)
                .map(existing -> {
                    // 기존 사용자: 카카오 정보 변경되었을 수 있으니 업데이트
                    existing.updateKakaoInfo(nickname, profileImage);
                    log.info("Existing user logged in: userId={}", existing.getId());
                    return existing;
                })
                .orElseGet(() -> {
                    // 신규 사용자: 새로 저장
                    User newUser = User.builder()
                            .kakaoId(kakaoId)
                            .nickname(nickname)
                            .profileImage(profileImage)
                            .build();
                    User saved = userRepository.save(newUser);
                    log.info("New user registered: userId={}", saved.getId());
                    return saved;
                });

        // 4. CustomOAuth2User로 감싸서 반환
        return new CustomOAuth2User(user, attributes);
    }

    @SuppressWarnings("unchecked")
    private String extractNickname(Map<String, Object> attributes) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        if (kakaoAccount == null) return null;
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
        if (profile == null) return null;
        return (String) profile.get("nickname");
    }

    @SuppressWarnings("unchecked")
    private String extractProfileImage(Map<String, Object> attributes) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        if (kakaoAccount == null) return null;
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
        if (profile == null) return null;
        return (String) profile.get("profile_image_url");
    }
}