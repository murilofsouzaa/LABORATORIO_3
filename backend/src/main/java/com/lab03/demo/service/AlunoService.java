package com.lab03.demo.service;

import com.lab03.demo.dto.AlunoCadastroDTO;
import com.lab03.demo.dto.AlunoResponseDTO;
import com.lab03.demo.dto.ExtratoResponseDTO;
import com.lab03.demo.dto.TransacaoResponseDTO;
import com.lab03.demo.exception.RecursoNaoEncontradoException;
import com.lab03.demo.exception.RegraNegocioException;
import com.lab03.demo.exception.SaldoInsuficienteException;
import com.lab03.demo.model.Aluno;
import com.lab03.demo.model.Instituicao;
import com.lab03.demo.model.Transacao;
import com.lab03.demo.model.Vantagem;
import com.lab03.demo.repository.AlunoRepository;
import com.lab03.demo.repository.InstituicaoRepository;
import com.lab03.demo.repository.TransacaoRepository;
import com.lab03.demo.repository.UtilizadorRepository;
import com.lab03.demo.repository.VantagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AlunoService {

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private UtilizadorRepository utilizadorRepository;

    @Autowired
    private InstituicaoRepository instituicaoRepository;

    @Autowired
    private VantagemRepository vantagemRepository;

    @Autowired
    private TransacaoRepository transacaoRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public AlunoResponseDTO cadastrar(AlunoCadastroDTO dto) {
        if (utilizadorRepository.existsByLogin(dto.getLogin())) {
            throw new RegraNegocioException("Login já está em uso por outro usuário");
        }
        if (alunoRepository.existsByCpf(dto.getCpf())) {
            throw new RegraNegocioException("CPF já cadastrado no sistema");
        }
        if (alunoRepository.existsByEmail(dto.getEmail())) {
            throw new RegraNegocioException("E-mail já cadastrado no sistema");
        }

        Instituicao inst = instituicaoRepository.findById(dto.getInstituicaoId())
            .orElseThrow(() -> new RecursoNaoEncontradoException("Instituição de ensino não encontrada"));

        Aluno aluno = new Aluno(
            dto.getLogin(),
            dto.getSenha(),
            dto.getNome(),
            dto.getEmail(),
            dto.getCpf(),
            dto.getRg(),
            dto.getEndereco(),
            dto.getCurso(),
            inst
        );

        Aluno salvo = alunoRepository.save(aluno);
        return new AlunoResponseDTO(salvo);
    }

    public List<AlunoResponseDTO> listarTodos() {
        return alunoRepository.findAll().stream()
            .map(AlunoResponseDTO::new)
            .collect(Collectors.toList());
    }

    public AlunoResponseDTO buscarPorId(Long id) {
        Aluno a = alunoRepository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado com ID: " + id));
        return new AlunoResponseDTO(a);
    }

    public ExtratoResponseDTO consultarExtrato(Long alunoId) {
        Aluno a = alunoRepository.findById(alunoId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado"));

        List<TransacaoResponseDTO> transacoes = transacaoRepository.findByAlunoIdOrderByDataDesc(alunoId).stream()
            .map(TransacaoResponseDTO::new)
            .collect(Collectors.toList());

        return new ExtratoResponseDTO(a.getSaldo(), transacoes);
    }

    @Transactional
    public TransacaoResponseDTO resgatarVantagem(Long alunoId, Long vantagemId) {
        Aluno aluno = alunoRepository.findById(alunoId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado"));

        Vantagem vantagem = vantagemRepository.findById(vantagemId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Vantagem não encontrada"));

        if (!aluno.debitarMoedas(vantagem.getCusto())) {
            throw new SaldoInsuficienteException(
                String.format("Saldo insuficiente para resgate. Saldo atual: %d, Custo da vantagem: %d", aluno.getSaldo(), vantagem.getCusto())
            );
        }

        alunoRepository.save(aluno);

        String codigoCupom = "CUPOM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Transacao transacao = Transacao.criarResgate(aluno, vantagem, codigoCupom);
        Transacao salva = transacaoRepository.save(transacao);

        // Disparo assíncrono de emails
        emailService.enviarCupomResgate(
            aluno.getEmail(),
            aluno.getNome(),
            vantagem.getEmpresa().getEmail(),
            vantagem.getEmpresa().getNome(),
            vantagem.getDescricao(),
            codigoCupom,
            vantagem.getCusto()
        );

        return new TransacaoResponseDTO(salva);
    }
}
