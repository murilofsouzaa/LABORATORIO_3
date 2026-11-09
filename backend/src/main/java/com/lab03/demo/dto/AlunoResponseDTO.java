package com.lab03.demo.dto;

import com.lab03.demo.model.Aluno;

public class AlunoResponseDTO {
    private Long id;
    private String login;
    private String nome;
    private String email;
    private String cpf;
    private String rg;
    private String endereco;
    private String curso;
    private int saldo;
    private String instituicaoNome;

    public AlunoResponseDTO() {}

    public AlunoResponseDTO(Aluno aluno) {
        this.id = aluno.getId();
        this.login = aluno.getLogin();
        this.nome = aluno.getNome();
        this.email = aluno.getEmail();
        this.cpf = aluno.getCpf();
        this.rg = aluno.getRg();
        this.endereco = aluno.getEndereco();
        this.curso = aluno.getCurso();
        this.saldo = aluno.getSaldo();
        if (aluno.getInstituicao() != null) {
            this.instituicaoNome = aluno.getInstituicao().getNome();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getRg() { return rg; }
    public void setRg(String rg) { this.rg = rg; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public String getCurso() { return curso; }
    public void setCurso(String curso) { this.curso = curso; }

    public int getSaldo() { return saldo; }
    public void setSaldo(int saldo) { this.saldo = saldo; }

    public String getInstituicaoNome() { return instituicaoNome; }
    public void setInstituicaoNome(String instituicaoNome) { this.instituicaoNome = instituicaoNome; }
}
