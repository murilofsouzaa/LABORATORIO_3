package com.lab03.demo.controller;

import com.lab03.demo.dto.EnviarMoedasDTO;
import com.lab03.demo.dto.ExtratoResponseDTO;
import com.lab03.demo.dto.ProfessorResponseDTO;
import com.lab03.demo.dto.TransacaoResponseDTO;
import com.lab03.demo.service.ProfessorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    @Autowired
    private ProfessorService professorService;

    @GetMapping
    public ResponseEntity<List<ProfessorResponseDTO>> listarTodos() {
        return ResponseEntity.ok(professorService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfessorResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(professorService.buscarPorId(id));
    }

    @GetMapping("/{id}/extrato")
    public ResponseEntity<ExtratoResponseDTO> consultarExtrato(@PathVariable Long id) {
        return ResponseEntity.ok(professorService.consultarExtrato(id));
    }

    @PostMapping("/{id}/enviar-moedas")
    public ResponseEntity<TransacaoResponseDTO> enviarMoedas(
            @PathVariable Long id,
            @Valid @RequestBody EnviarMoedasDTO dto) {
        TransacaoResponseDTO response = professorService.enviarMoedas(id, dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/adicionar-cota")
    public ResponseEntity<Void> adicionarCota(@PathVariable Long id) {
        professorService.adicionarCotaSemestral(id);
        return ResponseEntity.ok().build();
    }
}
