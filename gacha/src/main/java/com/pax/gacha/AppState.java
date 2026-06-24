package com.pax.gacha;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class AppState {
    
    @Id
    private Long id = 1L; // Hardcoded to 1
    
    private int tabiCoins;

    public AppState() {}
    
    public AppState(int tabiCoins) {
        this.tabiCoins = tabiCoins;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public int getTabiCoins() { return tabiCoins; }
    public void setTabiCoins(int tabiCoins) { this.tabiCoins = tabiCoins; }
}