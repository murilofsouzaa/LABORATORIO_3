package com.lab03.demo.controller;

import com.lab03.demo.dto.AlunoCadastroDTO;
import com.lab03.demo.dto.AlunoResponseDTO;
import com.lab03.demo.dto.ExtratoResponseDTO;
import com.lab03.demo.dto.TransacaoResponseDTO;
import com.lab03.demo.service.AlunoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    @Autowired
    private AlunoService alunoService;

    @PostMapping
    public ResponseEntity<AlunoResponseDTO> cadastrar(@Valid @RequestBody AlunoCadastroDTO dto) {
        AlunoResponseDTO response = alunoService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<AlunoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(alunoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlunoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.buscarPorId(id));
    }

    @GetMapping("/{id}/extrato")
    public ResponseEntity<ExtratoResponseDTO> consultarExtrato(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.consultarExtrato(id));
    }

    @PostMapping("/{id}/resgatar/{vantagemId}")
    public ResponseEntity<TransacaoResponseDTO> resgatarVantagem(
            @PathVariable Long id,
            @PathVariable Long vantagemId) {
        TransacaoResponseDTO response = alunoService.resgatarVantagem(id, vantagemId);
        return ResponseEntity.ok(response);
    }
}
