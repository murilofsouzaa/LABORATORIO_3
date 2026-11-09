package com.lab03.demo.repository;

import com.lab03.demo.model.Utilizador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilizadorRepository extends JpaRepository<Utilizador, Long> {
    Optional<Utilizador> findByLogin(String login);
    boolean existsByLogin(String login);
}
