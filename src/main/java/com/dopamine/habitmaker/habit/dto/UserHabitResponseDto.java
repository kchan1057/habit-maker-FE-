package com.dopamine.habitmaker.habit.dto;

import java.time.LocalDateTime;
public record UserHabitResponseDto(
    Long id,
    Long userId,
    String habitName,
    String habitDescription,
    Long userLevel,
    LocalDateTime createdAt
) {
}
