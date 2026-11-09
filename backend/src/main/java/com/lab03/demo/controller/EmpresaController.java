package com.lab03.demo.controller;

import com.lab03.demo.dto.EmpresaCadastroDTO;
import com.lab03.demo.dto.EmpresaResponseDTO;
import com.lab03.demo.dto.TransacaoResponseDTO;
import com.lab03.demo.dto.VantagemCadastroDTO;
import com.lab03.demo.dto.VantagemResponseDTO;
import com.lab03.demo.service.EmpresaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    @PostMapping
    public ResponseEntity<EmpresaResponseDTO> cadastrar(@Valid @RequestBody EmpresaCadastroDTO dto) {
        EmpresaResponseDTO response = empresaService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<EmpresaResponseDTO>> listarTodas() {
        return ResponseEntity.ok(empresaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpresaResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(empresaService.buscarPorId(id));
    }

    @PostMapping("/{id}/vantagens")
    public ResponseEntity<VantagemResponseDTO> cadastrarVantagem(
            @PathVariable Long id,
            @Valid @RequestBody VantagemCadastroDTO dto) {
        VantagemResponseDTO response = empresaService.cadastrarVantagem(id, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}/vantagens")
    public ResponseEntity<List<VantagemResponseDTO>> listarVantagens(@PathVariable Long id) {
        return ResponseEntity.ok(empresaService.listarVantagens(id));
    }

    @GetMapping("/validar-cupom/{codigoCupom}")
    public ResponseEntity<TransacaoResponseDTO> validarCupom(@PathVariable String codigoCupom) {
        return ResponseEntity.ok(empresaService.validarCupom(codigoCupom));
    }
}
