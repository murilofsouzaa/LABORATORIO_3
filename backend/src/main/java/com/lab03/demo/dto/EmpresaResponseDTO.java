package com.lab03.demo.dto;

import com.lab03.demo.model.EmpresaParceira;

public class EmpresaResponseDTO {
    private Long id;
    private String login;
    private String nome;
    private String email;

    public EmpresaResponseDTO() {}

    public EmpresaResponseDTO(EmpresaParceira e) {
        this.id = e.getId();
        this.login = e.getLogin();
        this.nome = e.getNome();
        this.email = e.getEmail();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
