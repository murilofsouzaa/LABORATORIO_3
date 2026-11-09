package com.lab03.demo.service;

import com.lab03.demo.dto.EmpresaCadastroDTO;
import com.lab03.demo.dto.EmpresaResponseDTO;
import com.lab03.demo.dto.TransacaoResponseDTO;
import com.lab03.demo.dto.VantagemCadastroDTO;
import com.lab03.demo.dto.VantagemResponseDTO;
import com.lab03.demo.exception.RecursoNaoEncontradoException;
import com.lab03.demo.exception.RegraNegocioException;
import com.lab03.demo.model.EmpresaParceira;
import com.lab03.demo.model.Transacao;
import com.lab03.demo.model.Vantagem;
import com.lab03.demo.repository.EmpresaParceiraRepository;
import com.lab03.demo.repository.TransacaoRepository;
import com.lab03.demo.repository.UtilizadorRepository;
import com.lab03.demo.repository.VantagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmpresaService {

    @Autowired
    private EmpresaParceiraRepository empresaRepository;

    @Autowired
    private UtilizadorRepository utilizadorRepository;

    @Autowired
    private VantagemRepository vantagemRepository;

    @Autowired
    private TransacaoRepository transacaoRepository;

    @Transactional
    public EmpresaResponseDTO cadastrar(EmpresaCadastroDTO dto) {
        if (utilizadorRepository.existsByLogin(dto.getLogin())) {
            throw new RegraNegocioException("Login já está em uso por outro usuário");
        }
        if (empresaRepository.existsByEmail(dto.getEmail())) {
            throw new RegraNegocioException("E-mail já cadastrado por outra empresa");
        }

        EmpresaParceira empresa = new EmpresaParceira(
            dto.getLogin(),
            dto.getSenha(),
            dto.getNome(),
            dto.getEmail()
        );

        EmpresaParceira salva = empresaRepository.save(empresa);
        return new EmpresaResponseDTO(salva);
    }

    public List<EmpresaResponseDTO> listarTodas() {
        return empresaRepository.findAll().stream()
            .map(EmpresaResponseDTO::new)
            .collect(Collectors.toList());
    }

    public EmpresaResponseDTO buscarPorId(Long id) {
        EmpresaParceira e = empresaRepository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Empresa parceira não encontrada"));
        return new EmpresaResponseDTO(e);
    }

    @Transactional
    public VantagemResponseDTO cadastrarVantagem(Long empresaId, VantagemCadastroDTO dto) {
        EmpresaParceira empresa = empresaRepository.findById(empresaId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Empresa parceira não encontrada"));

        Vantagem v = new Vantagem(dto.getDescricao(), dto.getFoto(), dto.getCusto(), empresa);
        Vantagem salva = vantagemRepository.save(v);
        return new VantagemResponseDTO(salva);
    }

    public List<VantagemResponseDTO> listarVantagens(Long empresaId) {
        return vantagemRepository.findByEmpresaId(empresaId).stream()
            .map(VantagemResponseDTO::new)
            .collect(Collectors.toList());
    }

    public TransacaoResponseDTO validarCupom(String codigoCupom) {
        Transacao t = transacaoRepository.findByCodigoCupom(codigoCupom)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Cupom não encontrado ou inválido: " + codigoCupom));
        return new TransacaoResponseDTO(t);
    }
}
