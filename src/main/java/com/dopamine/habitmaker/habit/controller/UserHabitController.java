package com.dopamine.habitmaker.habit.controller;

import com.dopamine.habitmaker.habit.dto.UserHabitRequestDto;
import com.dopamine.habitmaker.habit.dto.UserHabitResponseDto;
import com.dopamine.habitmaker.habit.service.UserHabitService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Getter
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/habits")
public class UserHabitController {

  private final UserHabitService userHabitService;

  @PostMapping("/{userId}")
  public ResponseEntity<UserHabitResponseDto> saveHabit(
      @PathVariable Long userId,
      @RequestBody UserHabitRequestDto userHabitRequestDto
  ) {
    UserHabitResponseDto response = userHabitService.saveHabit(userId, userHabitRequestDto);
    log.info("습관 저장 성공 - UserId: {}, HabitId: {}", response.userId(), response.id());

    return ResponseEntity.ok(response);
  }
}
