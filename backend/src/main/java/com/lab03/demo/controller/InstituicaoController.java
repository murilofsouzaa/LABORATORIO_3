package com.lab03.demo.controller;

import com.lab03.demo.model.Instituicao;
import com.lab03.demo.repository.InstituicaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/instituicoes")
public class InstituicaoController {

    @Autowired
    private InstituicaoRepository instituicaoRepository;

    @GetMapping
    public ResponseEntity<List<Instituicao>> listarTodas() {
        return ResponseEntity.ok(instituicaoRepository.findAll());
    }
}
