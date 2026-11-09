package com.lab03.demo.repository;

import com.lab03.demo.model.EmpresaParceira;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpresaParceiraRepository extends JpaRepository<EmpresaParceira, Long> {
    Optional<EmpresaParceira> findByLogin(String login);
    Optional<EmpresaParceira> findByEmail(String email);
    boolean existsByEmail(String email);
}
