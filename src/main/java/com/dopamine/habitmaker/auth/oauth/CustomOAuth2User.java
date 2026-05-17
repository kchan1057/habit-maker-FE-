package com.dopamine.habitmaker.auth.oauth;

import com.dopamine.habitmaker.user.domain.Role;
import com.dopamine.habitmaker.user.domain.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Getter
public class CustomOAuth2User implements OAuth2User {

    private final User user;
    private final Map<String, Object> attributes;  // 카카오 원본 응답

    public CustomOAuth2User(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(user.getRole().name()));
    }

    /** OAuth2 식별자. 우리는 user의 PK (id) 사용. */
    @Override
    public String getName() {
        return String.valueOf(user.getId());
    }

    /** 편의 메서드 */
    public Long getUserId() {
        return user.getId();
    }

    public Role getRole() {
        return user.getRole();
    }
}