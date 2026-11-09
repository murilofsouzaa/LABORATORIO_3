package com.lab03.demo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EnviarMoedasDTO {
    @NotNull(message = "Identificador do aluno é obrigatório")
    private Long alunoId;

    @NotNull(message = "Valor das moedas é obrigatório")
    @Min(value = 1, message = "O valor mínimo de envio é 1 moeda")
    private Integer valor;

    @NotBlank(message = "Mensagem obrigatória de justificação para reconhecimento")
    private String motivo;

    public EnviarMoedasDTO() {}

    public Long getAlunoId() { return alunoId; }
    public void setAlunoId(Long alunoId) { this.alunoId = alunoId; }

    public Integer getValor() { return valor; }
    public void setValor(Integer valor) { this.valor = valor; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
}
