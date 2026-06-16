package SpkTeam.controller;

import SpkTeam.Dto.*;
import SpkTeam.entity.Holding;
import SpkTeam.entity.Portfolio;
import SpkTeam.jwtToken.JwtUtil;
import SpkTeam.repository.holdingsRepository;
import SpkTeam.service.PortfolioService;
import SpkTeam.service.PortfolioSnapshotJob;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/portfolios")
@CrossOrigin(origins = "http://localhost:4200")
public class PortfolioController {
    private final PortfolioService portfolioService;
    private final JwtUtil jtwUtil;
    private final holdingsRepository holdingsRepository;
    private final PortfolioSnapshotJob portfolioSnapshotJob;

    public PortfolioController(PortfolioService portfolioService, JwtUtil jtwUtil, holdingsRepository holdingsRepository, PortfolioSnapshotJob portfolioSnapshotJob) {
        this.portfolioService = portfolioService;
        this.jtwUtil = jtwUtil;
        this.holdingsRepository = holdingsRepository;
        this.portfolioSnapshotJob = portfolioSnapshotJob;
    }

    // GET /portfolios
    // Header: Authorization: Bearer <token>
    @GetMapping
    public List<PortfolioDto> getUserPortfolio(@RequestHeader ("Authorization") String authToken){
        String token = authToken.replace("Bearer ", "");
        String email = jtwUtil.extractEmail(token);

        return portfolioService.getUserPortfolios(email);
    }
    
    // POST /portfolios
    // body: { "name": "My Crypto" }
    @PostMapping
    public Portfolio createPortfolio(@RequestHeader ("Authorization") String authToken, @RequestBody Map<String, String> body){
        String token = authToken.replace("Bearer ", "");
        String email = jtwUtil.extractEmail(token);

        return portfolioService.createPortfolio(email, body.get("name"));
    }

    // DELETE /portfolios/{id}
    @DeleteMapping("/{id}")
    public void deletePortfolio(@PathVariable Long id){
        portfolioService.deletePortfolio(id);
    }

    // GET /portfolios/{id}/holdings
    @GetMapping("/{id}/holdings")
    public List<HoldingResponse> getHoldings(@PathVariable Long id) {
        return portfolioService.getHoldings(id);
    }

    // POST /portfolios/{id}/holdings
    @PostMapping("/{id}/holdings")
    public HoldingResponse addNewHolding(@PathVariable Long id, @RequestBody AddHoldingRequest request){
        return portfolioService.addNewHolding(id, request);
    }

    @DeleteMapping("/{portfolioId}/holdings/{holdingId}")
    public ResponseEntity<Void> deleteHolding(@PathVariable Long portfolioId, @PathVariable Long holdingId){
        Holding holding = holdingsRepository.findById(holdingId)
                .orElseThrow(() -> new RuntimeException("Holding not found"));

        // перевіряємо що цей холдинг належить саме цьому портфелю
        if (!holding.getPortfolio().getId().equals(portfolioId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        holdingsRepository.deleteById(holdingId);

        return ResponseEntity.ok().build();
    }


    // GET /portfolios/{id}/snapshots?period=3M
    @GetMapping("/{id}/snapshots")
    public List<SnapshotsDto> getPortfolioSnapshots(@PathVariable Long id, @RequestParam(defaultValue = "3M") String period){
        return portfolioService.getPortfolioSnapshots(id, period);
    }

    // GET /portfolios/account/snapshots?period=3M
    @GetMapping("/account/snapshots")
    public List<SnapshotsDto> getAccountSnapshots(@RequestHeader ("Authorization") String header,
                                                  @RequestParam(defaultValue = "3M") String period){
        String token = header.replace("Bearer ", "").trim();
        String email = jtwUtil.extractEmail(token);
        return portfolioService.getAccountSnapshots(email, period);
    }

    @GetMapping("/statistics")
    public PerformerDto getStatistics(@RequestHeader ("Authorization") String header){
        String token = header.replace("Bearer ", "").trim();
        String email = jtwUtil.extractEmail(token);
        return portfolioService.getStatisticOfPortfolios(email);
    }

    @GetMapping("/top-portfolio")
    public TopPortfolioDto getTopPortfolio(@RequestHeader ("Authorization") String header) {
        String token = header.replace("Bearer ", "").trim();
        String email = jtwUtil.extractEmail(token);

        return portfolioService.getTopPortfolio(email);
    }

    @PostMapping("/snapshots/save-now")
    public ResponseEntity<String> saveNow() {
        portfolioSnapshotJob.saveSnapshot();
        return ResponseEntity.ok("Snapshots saved!");
    }
}