package com.dopamine.habitmaker.user.repository;

import com.dopamine.habitmaker.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** kakaoId로 사용자 찾기. 카카오 로그인 시 "이미 가입한 사용자인지" 체크용. */
    Optional<User> findByKakaoId(Long kakaoId);

    /** kakaoId 존재 여부만 확인 (가벼운 체크용) */
    boolean existsByKakaoId(Long kakaoId);
}