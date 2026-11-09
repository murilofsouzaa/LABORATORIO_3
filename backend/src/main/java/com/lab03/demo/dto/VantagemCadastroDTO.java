package com.lab03.demo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VantagemCadastroDTO {
    @NotBlank(message = "Descrição é obrigatória")
    private String descricao;

    @NotBlank(message = "Foto/imagem do produto é obrigatória")
    private String foto;

    @NotNull(message = "Custo em moedas é obrigatório")
    @Min(value = 1, message = "O custo mínimo é 1 moeda")
    private Integer custo;

    public VantagemCadastroDTO() {}

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }

    public Integer getCusto() { return custo; }
    public void setCusto(Integer custo) { this.custo = custo; }
}
