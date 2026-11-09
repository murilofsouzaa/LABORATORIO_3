package com.lab03.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "utilizadores")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Utilizador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String login;

    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoUtilizador tipo;

    public Utilizador() {}

    public Utilizador(String login, String senha, TipoUtilizador tipo) {
        this.login = login;
        this.senha = senha;
        this.tipo = tipo;
    }

    public boolean autenticar(String senhaInformada) {
        return this.senha != null && this.senha.equals(senhaInformada);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public TipoUtilizador getTipo() { return tipo; }
    public void setTipo(TipoUtilizador tipo) { this.tipo = tipo; }
}
