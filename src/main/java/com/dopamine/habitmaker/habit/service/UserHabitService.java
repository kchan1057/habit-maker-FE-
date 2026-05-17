package com.dopamine.habitmaker.habit.service;

import com.dopamine.habitmaker.habit.dto.UserHabitRequestDto;
import com.dopamine.habitmaker.habit.dto.UserHabitResponseDto;

public interface UserHabitService {

  UserHabitResponseDto saveHabit(Long userId, UserHabitRequestDto userHabitRequestDto);
}
