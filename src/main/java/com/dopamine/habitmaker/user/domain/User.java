package com.dopamine.habitmaker.user.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===== 카카오에서 받는 정보 =====
    @Column(nullable = false, unique = true)
    private Long kakaoId;          // 카카오 고유 ID (식별자)

    @Column(length = 50)
    private String nickname;       // 카카오 닉네임

    @Column(length = 500)
    private String profileImage;   // 프로필 이미지 URL

    // ===== 추가 입력 정보 (로그인 후 입력받음) =====
    @Column(length = 4)
    private String mbti;           // ENFP, INTJ 등

    private Integer age;

    @Column(length = 20)
    private String job;            // 학생, 직장인 등

    @Column(length = 10)
    private String gender;         // MALE, FEMALE, OTHER

    private LocalTime sleepTime;   // 자는 시간 (예: 23:30)

    private LocalTime wakeTime;    // 일어나는 시간 (예: 07:00)

    // ===== 시스템 메타데이터 =====
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;             // USER, ADMIN

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // ===== 생성자 (Builder 패턴) =====
    @Builder
    public User(Long kakaoId, String nickname, String profileImage) {
        this.kakaoId = kakaoId;
        this.nickname = nickname;
        this.profileImage = profileImage;
        this.role = Role.USER;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // ===== 비즈니스 메서드 =====

    public void updateKakaoInfo(String nickname, String profileImage) {
        this.nickname = nickname;
        this.profileImage = profileImage;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateProfile(String mbti, Integer age, String job, String gender,
                              LocalTime sleepTime, LocalTime wakeTime) {
        this.mbti = mbti;
        this.age = age;
        this.job = job;
        this.gender = gender;
        this.sleepTime = sleepTime;
        this.wakeTime = wakeTime;
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isOnboardingCompleted() {
        return mbti != null && age != null && job != null && gender != null
                && sleepTime != null && wakeTime != null;
    }
}