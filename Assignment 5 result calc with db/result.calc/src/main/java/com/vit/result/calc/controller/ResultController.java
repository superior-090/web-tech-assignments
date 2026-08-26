package com.vit.result.calc.controller;

import com.vit.result.calc.entity.Result;
import com.vit.result.calc.service.ResultService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/results") @CrossOrigin(origins = "*")
public class ResultController {
    private final ResultService resultService;
    public ResultController(ResultService resultService) { this.resultService = resultService; }
    @PostMapping public ResponseEntity<Result> saveResult(@Valid @RequestBody Result result) { return ResponseEntity.ok(resultService.saveResult(result)); }
    @GetMapping public ResponseEntity<List<Result>> getAllResults() { return ResponseEntity.ok(resultService.getAllResults()); }
    @GetMapping("/{prn}") public ResponseEntity<Result> getResultByPrn(@PathVariable Integer prn) { return resultService.getResultByPrn(prn).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build()); }
    @DeleteMapping("/{prn}") public ResponseEntity<Void> deleteResult(@PathVariable Integer prn) { resultService.deleteResult(prn); return ResponseEntity.noContent().build(); }
}
