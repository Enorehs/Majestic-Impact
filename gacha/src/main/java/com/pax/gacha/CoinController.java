package com.pax.gacha;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coins")
@CrossOrigin(origins = "*")
public class CoinController {

    @Autowired
    private AppStateRepository repository;

    @GetMapping
    public int getCoins() {
        AppState state = repository.findById(1L).orElse(new AppState(1600)); 
        return state.getTabiCoins();
    }

    @PostMapping("/update")
    public int updateCoins(@RequestParam int newBalance) {
        AppState state = repository.findById(1L).orElse(new AppState());
        state.setTabiCoins(newBalance);
        repository.save(state);
        return state.getTabiCoins();
    }
}