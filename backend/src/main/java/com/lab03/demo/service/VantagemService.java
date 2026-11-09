package com.lab03.demo.service;

import com.lab03.demo.dto.VantagemResponseDTO;
import com.lab03.demo.exception.RecursoNaoEncontradoException;
import com.lab03.demo.model.Vantagem;
import com.lab03.demo.repository.VantagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VantagemService {

    @Autowired
    private VantagemRepository vantagemRepository;

    public List<VantagemResponseDTO> listarTodas() {
        return vantagemRepository.findAll().stream()
            .map(VantagemResponseDTO::new)
            .collect(Collectors.toList());
    }

    public VantagemResponseDTO buscarPorId(Long id) {
        Vantagem v = vantagemRepository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Vantagem não encontrada"));
        return new VantagemResponseDTO(v);
    }

    public void remover(Long id) {
        if (!vantagemRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Vantagem não encontrada");
        }
        vantagemRepository.deleteById(id);
    }
}
