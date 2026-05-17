package com.dopamine.habitmaker.habit.repository;

import com.dopamine.habitmaker.habit.domain.UserHabit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserHabitRepository extends JpaRepository<UserHabit, Long> {

}
