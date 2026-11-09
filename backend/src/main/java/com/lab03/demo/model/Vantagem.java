package com.lab03.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vantagens")
public class Vantagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String descricao;

    @Column(nullable = false, length = 2000)
    private String foto;

    @Column(nullable = false)
    private int custo;

    @ManyToOne(optional = false)
    @JoinColumn(name = "empresa_id")
    private EmpresaParceira empresa;

    public Vantagem() {}

    public Vantagem(String descricao, String foto, int custo, EmpresaParceira empresa) {
        this.descricao = descricao;
        this.foto = foto;
        this.custo = custo;
        this.empresa = empresa;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }

    public int getCusto() { return custo; }
    public void setCusto(int custo) { this.custo = custo; }

    public EmpresaParceira getEmpresa() { return empresa; }
    public void setEmpresa(EmpresaParceira empresa) { this.empresa = empresa; }
}
