package com.dopamine.habitmaker.user.dto;

import jakarta.validation.constraints.*;

import java.time.LocalTime;

public record UserProfileRequest(
        @NotBlank(message = "MBTI는 필수입니다")
        @Pattern(regexp= "^[EI][NS][TF][JP]$", message= "유효하지 않는 MBTI 형식입니다")
        String mbti,

        @NotNull(message = "나이는 필수입니다")
        @Min(value = 1, message = "나이는 1살 이상이어야 합니다")
        @Max(value = 150, message = "나이는 150살 이하여야 합니다")
        Integer age,

        @NotBlank(message = "직업은 필수입니다")
        @Size(max = 20, message = "직업은 20자 이하여야 합니다")
        String job,

        @NotBlank(message = "나이는 필수입니다")
        @Pattern(regexp = "^(MALE|FEMALE|M|m|F|f)$", message = "성별은 MALE, FEMALE, M, m, F, f 중 하나여야 합니다")
        String gender,

        @NotNull(message = "자는 시간은 필수입니다")
        LocalTime sleepTime,

        @NotNull(message = "일어나는 시간은 필수입니다")
        LocalTime wakeTime
){

}