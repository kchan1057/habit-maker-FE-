package com.dopamine.habitmaker.user.controller;

import com.dopamine.habitmaker.auth.CurrentUser;
import com.dopamine.habitmaker.user.service.UserService;
import com.dopamine.habitmaker.user.dto.UserProfileRequest;
import com.dopamine.habitmaker.user.dto.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    /* 내 정보 조회 */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@CurrentUser Long userId) {
        return ResponseEntity.ok(userService.getMyInfo(userId));
    }

    /** 사용자 추가 정보 입력 (온보딩) */
    @PatchMapping("/me/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @CurrentUser Long userId,
            @Valid @RequestBody UserProfileRequest request
    ) {
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }
}
