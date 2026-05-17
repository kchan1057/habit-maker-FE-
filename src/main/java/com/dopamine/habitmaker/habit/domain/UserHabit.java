package com.dopamine.habitmaker.habit.domain;

import com.dopamine.habitmaker.habit.dto.UserHabitRequestDto;
import com.dopamine.habitmaker.user.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_habit")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserHabit {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "habit_name", nullable = false)
  private String habitName;

  @Column(name = "habit_description", nullable = false)
  private String habitDescription;

  @Column(name = "user_level", nullable = false)
  private Long userLevel;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @Builder
  public UserHabit(User user, String habitName, String habitDescription, Long userLevel, LocalDateTime createdAt){
    this.user = user;
    this.habitName = habitName;
    this.habitDescription = habitDescription;
    this.userLevel = userLevel;
    this.createdAt = LocalDateTime.now();
  }

  public static UserHabit create(User user, UserHabitRequestDto dto) {
    return UserHabit.builder()
        .user(user)
        .habitName(dto.habitName())
        .habitDescription(dto.habitDescription())
        .userLevel(dto.userLevel())
        .createdAt(dto.createdAt())
        .build();
  }
}
