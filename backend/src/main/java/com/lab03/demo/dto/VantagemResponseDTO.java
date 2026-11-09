package com.lab03.demo.dto;

import com.lab03.demo.model.Vantagem;

public class VantagemResponseDTO {
    private Long id;
    private String descricao;
    private String foto;
    private int custo;
    private Long empresaId;
    private String empresaNome;

    public VantagemResponseDTO() {}

    public VantagemResponseDTO(Vantagem v) {
        this.id = v.getId();
        this.descricao = v.getDescricao();
        this.foto = v.getFoto();
        this.custo = v.getCusto();
        if (v.getEmpresa() != null) {
            this.empresaId = v.getEmpresa().getId();
            this.empresaNome = v.getEmpresa().getNome();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }

    public int getCusto() { return custo; }
    public void setCusto(int custo) { this.custo = custo; }

    public Long getEmpresaId() { return empresaId; }
    public void setEmpresaId(Long empresaId) { this.empresaId = empresaId; }

    public String getEmpresaNome() { return empresaNome; }
    public void setEmpresaNome(String empresaNome) { this.empresaNome = empresaNome; }
}
