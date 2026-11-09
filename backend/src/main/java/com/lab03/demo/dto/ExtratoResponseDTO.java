package com.lab03.demo.dto;

import java.util.List;

public class ExtratoResponseDTO {
    private int saldo;
    private List<TransacaoResponseDTO> transacoes;

    public ExtratoResponseDTO() {}

    public ExtratoResponseDTO(int saldo, List<TransacaoResponseDTO> transacoes) {
        this.saldo = saldo;
        this.transacoes = transacoes;
    }

    public int getSaldo() { return saldo; }
    public void setSaldo(int saldo) { this.saldo = saldo; }

    public List<TransacaoResponseDTO> getTransacoes() { return transacoes; }
    public void setTransacoes(List<TransacaoResponseDTO> transacoes) { this.transacoes = transacoes; }
}
