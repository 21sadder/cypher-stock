package SpkTeam.controller;

import SpkTeam.Dto.TradeRequest;
import SpkTeam.Dto.TradeResponse;
import SpkTeam.jwtToken.JwtUtil;
import SpkTeam.repository.portfolioRepository;
import SpkTeam.service.TradeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trade")
@CrossOrigin(origins = "http://localhost:4200")
public class TradeController {

    private final TradeService tradeService;
    private final JwtUtil jwtUtil;
    private final portfolioRepository portfolioRepository;

    public TradeController(TradeService tradeService,
                           JwtUtil jwtUtil,
                           portfolioRepository portfolioRepository) {
        this.tradeService = tradeService;
        this.jwtUtil = jwtUtil;
        this.portfolioRepository = portfolioRepository;
    }

    // POST /trade/{portfolioId}/buy
    @PostMapping("/{portfolioId}/buy")
    public ResponseEntity<TradeResponse> buy(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long portfolioId,
            @RequestBody TradeRequest request) {

        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));

        portfolioRepository.findById(portfolioId)
                .filter(p -> p.getUserEmail().equals(email))
                .orElseThrow(() -> new RuntimeException("Access denied"));

        return ResponseEntity.ok(tradeService.buy(portfolioId, request));
    }

    // POST /trade/{portfolioId}/sell
    @PostMapping("/{portfolioId}/sell")
    public ResponseEntity<TradeResponse> sell(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long portfolioId,
            @RequestBody TradeRequest request) {

        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));

        portfolioRepository.findById(portfolioId)
                .filter(p -> p.getUserEmail().equals(email))
                .orElseThrow(() -> new RuntimeException("Access denied"));

        return ResponseEntity.ok(tradeService.sell(portfolioId, request));
    }

    // GET /trade/{portfolioId}/history
    @GetMapping("/{portfolioId}/history")
    public ResponseEntity<List<TradeResponse>> getHistory(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long portfolioId) {

        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));

        portfolioRepository.findById(portfolioId)
                .filter(p -> p.getUserEmail().equals(email))
                .orElseThrow(() -> new RuntimeException("Access denied"));

        return ResponseEntity.ok(tradeService.getHistory(portfolioId));
    }

    // GET /trade/account/history
    @GetMapping("/account/history")
    public ResponseEntity<List<TradeResponse>> getAccountHistory(
            @RequestHeader("Authorization") String authHeader) {
        String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", "").trim());
        return ResponseEntity.ok(tradeService.getAccountHistory(email));
    }
}