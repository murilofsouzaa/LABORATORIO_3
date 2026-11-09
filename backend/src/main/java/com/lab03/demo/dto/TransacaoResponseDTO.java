package com.lab03.demo.dto;

import com.lab03.demo.model.TipoTransacao;
import com.lab03.demo.model.Transacao;

import java.time.LocalDateTime;

public class TransacaoResponseDTO {
    private Long id;
    private int valor;
    private String motivo;
    private LocalDateTime data;
    private TipoTransacao tipo;
    private String remetenteNome;
    private String alunoNome;
    private String vantagemDescricao;
    private String codigoCupom;

    public TransacaoResponseDTO() {}

    public TransacaoResponseDTO(Transacao t) {
        this.id = t.getId();
        this.valor = t.getValor();
        this.motivo = t.getMotivo();
        this.data = t.getData();
        this.tipo = t.getTipo();
        this.codigoCupom = t.getCodigoCupom();
        if (t.getRemetente() != null) {
            this.remetenteNome = t.getRemetente().getNome();
        }
        if (t.getAluno() != null) {
            this.alunoNome = t.getAluno().getNome();
        }
        if (t.getVantagem() != null) {
            this.vantagemDescricao = t.getVantagem().getDescricao();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getValor() { return valor; }
    public void setValor(int valor) { this.valor = valor; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public LocalDateTime getData() { return data; }
    public void setData(LocalDateTime data) { this.data = data; }

    public TipoTransacao getTipo() { return tipo; }
    public void setTipo(TipoTransacao tipo) { this.tipo = tipo; }

    public String getRemetenteNome() { return remetenteNome; }
    public void setRemetenteNome(String remetenteNome) { this.remetenteNome = remetenteNome; }

    public String getAlunoNome() { return alunoNome; }
    public void setAlunoNome(String alunoNome) { this.alunoNome = alunoNome; }

    public String getVantagemDescricao() { return vantagemDescricao; }
    public void setVantagemDescricao(String vantagemDescricao) { this.vantagemDescricao = vantagemDescricao; }

    public String getCodigoCupom() { return codigoCupom; }
    public void setCodigoCupom(String codigoCupom) { this.codigoCupom = codigoCupom; }
}
