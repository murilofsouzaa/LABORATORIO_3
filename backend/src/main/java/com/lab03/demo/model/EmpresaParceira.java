package com.lab03.demo.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "empresas_parceiras")
public class EmpresaParceira extends Utilizador {

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vantagem> vantagens = new ArrayList<>();

    public EmpresaParceira() {
        super();
        setTipo(TipoUtilizador.EMPRESA);
    }

    public EmpresaParceira(String login, String senha, String nome, String email) {
        super(login, senha, TipoUtilizador.EMPRESA);
        this.nome = nome;
        this.email = email;
    }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public List<Vantagem> getVantagens() { return vantagens; }
    public void setVantagens(List<Vantagem> vantagens) { this.vantagens = vantagens; }
}
