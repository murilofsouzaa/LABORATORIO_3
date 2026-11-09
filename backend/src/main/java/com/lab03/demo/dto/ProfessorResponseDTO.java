package com.lab03.demo.dto;

import com.lab03.demo.model.Professor;

public class ProfessorResponseDTO {
    private Long id;
    private String login;
    private String nome;
    private String cpf;
    private String departamento;
    private int saldo;
    private String instituicaoNome;

    public ProfessorResponseDTO() {}

    public ProfessorResponseDTO(Professor p) {
        this.id = p.getId();
        this.login = p.getLogin();
        this.nome = p.getNome();
        this.cpf = p.getCpf();
        this.departamento = p.getDepartamento();
        this.saldo = p.getSaldo();
        if (p.getInstituicao() != null) {
            this.instituicaoNome = p.getInstituicao().getNome();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }

    public int getSaldo() { return saldo; }
    public void setSaldo(int saldo) { this.saldo = saldo; }

    public String getInstituicaoNome() { return instituicaoNome; }
    public void setInstituicaoNome(String instituicaoNome) { this.instituicaoNome = instituicaoNome; }
}
