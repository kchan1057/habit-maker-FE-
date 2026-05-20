package com.dopamine.habitmaker.user.service;

import com.dopamine.habitmaker.user.domain.User;
import com.dopamine.habitmaker.user.repository.UserRepository;
import com.dopamine.habitmaker.user.dto.UserProfileRequest;
import com.dopamine.habitmaker.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    /** 내 정보 조회 */
    @Transactional(readOnly = true)
    public UserResponse getMyInfo(Long userId) {
        User user = findUserById(userId);
        return UserResponse.from(user);
    }

    /** 사용자 추가 정보 입력 (온보딩) */
    @Transactional
    public UserResponse updateProfile(Long userId, UserProfileRequest request) {
        User user = findUserById(userId);

        user.updateProfile(
                request.mbti(),
                request.age(),
                request.job(),
                request.gender(),
                request.sleepTime(),
                request.wakeTime()
        );

        log.info("User profile updated: userId={}", userId);
        return UserResponse.from(user);
    }

    /** 공통: userId로 User 찾기 (없으면 예외) */
    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found: userId=" + userId));
    }
}