package com.lab03.demo.service;

import com.lab03.demo.dto.LoginRequestDTO;
import com.lab03.demo.dto.LoginResponseDTO;
import com.lab03.demo.exception.RegraNegocioException;
import com.lab03.demo.model.Aluno;
import com.lab03.demo.model.EmpresaParceira;
import com.lab03.demo.model.Professor;
import com.lab03.demo.model.Utilizador;
import com.lab03.demo.repository.UtilizadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UtilizadorRepository utilizadorRepository;

    public LoginResponseDTO autenticar(LoginRequestDTO dto) {
        Utilizador user = utilizadorRepository.findByLogin(dto.getLogin())
            .orElseThrow(() -> new RegraNegocioException("Usuário ou senha inválidos"));

        if (!user.autenticar(dto.getSenha())) {
            throw new RegraNegocioException("Usuário ou senha inválidos");
        }

        String nome = user.getLogin();
        Integer saldo = null;

        if (user instanceof Aluno a) {
            nome = a.getNome();
            saldo = a.getSaldo();
        } else if (user instanceof Professor p) {
            nome = p.getNome();
            saldo = p.getSaldo();
        } else if (user instanceof EmpresaParceira ep) {
            nome = ep.getNome();
        }

        return new LoginResponseDTO(user.getId(), user.getLogin(), nome, user.getTipo(), saldo);
    }
}
