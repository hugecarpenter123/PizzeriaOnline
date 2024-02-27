package com.example.Pizzeriabackend.repository;

import com.example.Pizzeriabackend.entity.AppInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppInfoRepository extends JpaRepository<AppInfo, Long> {
}
