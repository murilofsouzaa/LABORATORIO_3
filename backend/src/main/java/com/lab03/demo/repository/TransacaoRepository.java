package com.lab03.demo.repository;

import com.lab03.demo.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    List<Transacao> findByAlunoIdOrderByDataDesc(Long alunoId);
    List<Transacao> findByRemetenteIdOrderByDataDesc(Long professorId);
    Optional<Transacao> findByCodigoCupom(String codigoCupom);
}
