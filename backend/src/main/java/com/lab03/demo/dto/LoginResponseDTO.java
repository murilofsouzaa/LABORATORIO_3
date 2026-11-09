package com.lab03.demo.dto;

import com.lab03.demo.model.TipoUtilizador;

public class LoginResponseDTO {
    private Long id;
    private String login;
    private String nome;
    private TipoUtilizador tipo;
    private Integer saldo;

    public LoginResponseDTO() {}

    public LoginResponseDTO(Long id, String login, String nome, TipoUtilizador tipo, Integer saldo) {
        this.id = id;
        this.login = login;
        this.nome = nome;
        this.tipo = tipo;
        this.saldo = saldo;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public TipoUtilizador getTipo() { return tipo; }
    public void setTipo(TipoUtilizador tipo) { this.tipo = tipo; }

    public Integer getSaldo() { return saldo; }
    public void setSaldo(Integer saldo) { this.saldo = saldo; }
}
