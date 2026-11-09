package com.lab03.demo.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "professores")
public class Professor extends Utilizador {

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(nullable = false)
    private String departamento;

    @Column(nullable = false)
    private int saldo = 1000;

    @ManyToOne(optional = false)
    @JoinColumn(name = "instituicao_id")
    private Instituicao instituicao;

    @OneToMany(mappedBy = "remetente", cascade = CascadeType.ALL)
    private List<Transacao> transacoesEnviadas = new ArrayList<>();

    public Professor() {
        super();
        setTipo(TipoUtilizador.PROFESSOR);
    }

    public Professor(String login, String senha, String nome, String cpf, String departamento, Instituicao instituicao) {
        super(login, senha, TipoUtilizador.PROFESSOR);
        this.nome = nome;
        this.cpf = cpf;
        this.departamento = departamento;
        this.instituicao = instituicao;
        this.saldo = 1000;
    }

    public void adicionarCotaSemestral() {
        this.saldo += 1000;
    }

    public boolean debitarMoedas(int valor) {
        if (valor > 0 && this.saldo >= valor) {
            this.saldo -= valor;
            return true;
        }
        return false;
    }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }

    public int getSaldo() { return saldo; }
    public void setSaldo(int saldo) { this.saldo = saldo; }

    public Instituicao getInstituicao() { return instituicao; }
    public void setInstituicao(Instituicao instituicao) { this.instituicao = instituicao; }

    public List<Transacao> getTransacoesEnviadas() { return transacoesEnviadas; }
    public void setTransacoesEnviadas(List<Transacao> transacoesEnviadas) { this.transacoesEnviadas = transacoesEnviadas; }
}
