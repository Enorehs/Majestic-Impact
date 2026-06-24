package com.pax.gacha;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppStateRepository extends JpaRepository<AppState, Long> {
}