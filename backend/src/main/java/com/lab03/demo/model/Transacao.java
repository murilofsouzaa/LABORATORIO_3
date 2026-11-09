package com.lab03.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacoes")
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int valor;

    @Column(nullable = false, length = 1000)
    private String motivo;

    @Column(nullable = false)
    private LocalDateTime data;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoTransacao tipo;

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Professor remetente;

    @ManyToOne(optional = false)
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "vantagem_id")
    private Vantagem vantagem;

    @Column(name = "codigo_cupom")
    private String codigoCupom;

    public Transacao() {}

    public static Transacao criarEnvioMoedas(Professor remetente, Aluno destinatario, int valor, String motivo) {
        Transacao t = new Transacao();
        t.remetente = remetente;
        t.aluno = destinatario;
        t.valor = valor;
        t.motivo = motivo;
        t.data = LocalDateTime.now();
        t.tipo = TipoTransacao.ENVIO_MOEDAS;
        return t;
    }

    public static Transacao criarResgate(Aluno aluno, Vantagem vantagem, String codigoCupom) {
        Transacao t = new Transacao();
        t.aluno = aluno;
        t.vantagem = vantagem;
        t.valor = vantagem.getCusto();
        t.motivo = "Resgate de Vantagem: " + vantagem.getDescricao();
        t.codigoCupom = codigoCupom;
        t.data = LocalDateTime.now();
        t.tipo = TipoTransacao.RESGATE_VANTAGEM;
        return t;
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

    public Professor getRemetente() { return remetente; }
    public void setRemetente(Professor remetente) { this.remetente = remetente; }

    public Aluno getAluno() { return aluno; }
    public void setAluno(Aluno aluno) { this.aluno = aluno; }

    public Vantagem getVantagem() { return vantagem; }
    public void setVantagem(Vantagem vantagem) { this.vantagem = vantagem; }

    public String getCodigoCupom() { return codigoCupom; }
    public void setCodigoCupom(String codigoCupom) { this.codigoCupom = codigoCupom; }
}
