package com.lab03.demo.controller;

import com.lab03.demo.dto.VantagemResponseDTO;
import com.lab03.demo.service.VantagemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vantagens")
public class VantagemController {

    @Autowired
    private VantagemService vantagemService;

    @GetMapping
    public ResponseEntity<List<VantagemResponseDTO>> listarTodas() {
        return ResponseEntity.ok(vantagemService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VantagemResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(vantagemService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        vantagemService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
