package com.lab03.demo.service;

import com.lab03.demo.dto.EnviarMoedasDTO;
import com.lab03.demo.dto.ExtratoResponseDTO;
import com.lab03.demo.dto.ProfessorResponseDTO;
import com.lab03.demo.dto.TransacaoResponseDTO;
import com.lab03.demo.exception.RecursoNaoEncontradoException;
import com.lab03.demo.exception.RegraNegocioException;
import com.lab03.demo.exception.SaldoInsuficienteException;
import com.lab03.demo.model.Aluno;
import com.lab03.demo.model.Professor;
import com.lab03.demo.model.Transacao;
import com.lab03.demo.repository.AlunoRepository;
import com.lab03.demo.repository.ProfessorRepository;
import com.lab03.demo.repository.TransacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorService {

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private TransacaoRepository transacaoRepository;

    @Autowired
    private EmailService emailService;

    public List<ProfessorResponseDTO> listarTodos() {
        return professorRepository.findAll().stream()
            .map(ProfessorResponseDTO::new)
            .collect(Collectors.toList());
    }

    public ProfessorResponseDTO buscarPorId(Long id) {
        Professor p = professorRepository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado"));
        return new ProfessorResponseDTO(p);
    }

    public ExtratoResponseDTO consultarExtrato(Long professorId) {
        Professor p = professorRepository.findById(professorId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado"));

        List<TransacaoResponseDTO> transacoes = transacaoRepository.findByRemetenteIdOrderByDataDesc(professorId).stream()
            .map(TransacaoResponseDTO::new)
            .collect(Collectors.toList());

        return new ExtratoResponseDTO(p.getSaldo(), transacoes);
    }

    @Transactional
    public TransacaoResponseDTO enviarMoedas(Long professorId, EnviarMoedasDTO dto) {
        if (dto.getMotivo() == null || dto.getMotivo().trim().isEmpty()) {
            throw new RegraNegocioException("A mensagem de justificação do reconhecimento é obrigatória");
        }
        if (dto.getValor() == null || dto.getValor() <= 0) {
            throw new RegraNegocioException("O valor de moedas deve ser maior que zero");
        }

        Professor prof = professorRepository.findById(professorId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado"));

        Aluno aluno = alunoRepository.findById(dto.getAlunoId())
            .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno destinatário não encontrado"));

        if (!prof.debitarMoedas(dto.getValor())) {
            throw new SaldoInsuficienteException(
                String.format("Saldo insuficiente para envio. Saldo atual: %d, Tentativa de envio: %d", prof.getSaldo(), dto.getValor())
            );
        }

        aluno.creditarMoedas(dto.getValor());

        professorRepository.save(prof);
        alunoRepository.save(aluno);

        Transacao transacao = Transacao.criarEnvioMoedas(prof, aluno, dto.getValor(), dto.getMotivo());
        Transacao salva = transacaoRepository.save(transacao);

        // Notificar aluno por e-mail
        emailService.enviarNotificacaoMoedasRecebidas(
            aluno.getEmail(),
            aluno.getNome(),
            prof.getNome(),
            dto.getValor(),
            dto.getMotivo()
        );

        return new TransacaoResponseDTO(salva);
    }

    @Transactional
    public void adicionarCotaSemestral(Long professorId) {
        Professor prof = professorRepository.findById(professorId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado"));
        prof.adicionarCotaSemestral();
        professorRepository.save(prof);
    }
}
