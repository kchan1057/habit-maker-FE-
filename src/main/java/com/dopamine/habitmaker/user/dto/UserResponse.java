package com.dopamine.habitmaker.user.dto;

import com.dopamine.habitmaker.user.domain.User;

import java.time.LocalTime;

public record UserResponse(
        Long id,
        String nickname,
        String profileImage,
        String mbti,
        Integer age,
        String job,
        String gender,
        LocalTime sleepTime,
        LocalTime wakeTime,
        boolean onboardingCompleted
){
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getNickname(),
                user.getProfileImage(),
                user.getMbti(),
                user.getAge(),
                user.getJob(),
                user.getGender(),
                user.getSleepTime(),
                user.getWakeTime(),
                user.isOnboardingCompleted()
        );
    }
}
