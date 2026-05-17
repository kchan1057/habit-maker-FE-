package com.dopamine.habitmaker.habit.service;


import com.dopamine.habitmaker.habit.domain.UserHabit;
import com.dopamine.habitmaker.habit.dto.UserHabitRequestDto;
import com.dopamine.habitmaker.habit.dto.UserHabitResponseDto;
import com.dopamine.habitmaker.habit.repository.UserHabitRepository;
import com.dopamine.habitmaker.user.domain.User;
import com.dopamine.habitmaker.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserHabitServiceImpl implements UserHabitService{

  private final UserHabitRepository userHabitRepository;
  private final UserRepository userRepository;

  @Override
  @Transactional
  public UserHabitResponseDto saveHabit(Long userId, UserHabitRequestDto userHabitRequestDto) {
    User user = userRepository.findById(userId).
        orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

    UserHabit habit = UserHabit.create(user, userHabitRequestDto);
    UserHabit saved = userHabitRepository.save(habit);

    return toDto(saved);
  }

  UserHabitResponseDto toDto(UserHabit userHabit){
    return new UserHabitResponseDto(
        userHabit.getId(),
        userHabit.getUser().getId(),
        userHabit.getHabitName(),
        userHabit.getHabitDescription(),
        userHabit.getUserLevel(),
        userHabit.getCreatedAt()
    );
  }

}
