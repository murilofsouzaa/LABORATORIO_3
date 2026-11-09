import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { UsuarioAutenticado, Aluno, Extrato } from '../types/api';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ProfessorDashboardProps {
  usuario: UsuarioAutenticado;
  onUpdateSaldo: (novoSaldo: number) => void;
}

export const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({ usuario, onUpdateSaldo }) => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [extrato, setExtrato] = useState<Extrato | null>(null);
  
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const [form, setForm] = useState({
    alunoId: 0,
    valor: 50,
    motivo: '',
  });

  const carregarAlunos = () => {
    api.alunos.listarTodos()
      .then((lista) => {
        setAlunos(lista);
        if (lista.length > 0 && form.alunoId === 0) {
          setForm((prev) => ({ ...prev, alunoId: lista[0].id }));
        }
      })
      .catch((err) => console.error('Erro ao listar alunos:', err));
  };

  const carregarExtrato = () => {
    api.professores.consultarExtrato(usuario.id)
      .then((res) => {
        setExtrato(res);
        onUpdateSaldo(res.saldo);
      })
      .catch((err) => console.error('Erro ao consultar extrato do professor:', err));
  };

  useEffect(() => {
    carregarAlunos();
    carregarExtrato();
  }, [usuario.id]);

  const handleEnviarMoedas = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    if (!form.motivo.trim()) {
      setErro('A mensagem de justificação do reconhecimento é obrigatória.');
      return;
    }
    if ((usuario.saldo || 0) < form.valor) {
      setErro(`Saldo insuficiente! Você possui ${usuario.saldo || 0} moedas, mas tentou enviar ${form.valor}.`);
      return;
    }

    setEnviando(true);
    try {
      const transacao = await api.professores.enviarMoedas(usuario.id, {
        alunoId: Number(form.alunoId),
        valor: Number(form.valor),
        motivo: form.motivo,
      });

      setSucesso(`Sucesso! Você transferiu ${transacao.valor} moedas para o(a) aluno(a) ${transacao.alunoNome}. O aluno foi notificado por e-mail.`);
      setForm((prev) => ({ ...prev, motivo: '', valor: 50 }));
      carregarExtrato();
    } catch (err: any) {
      setErro(err.message || 'Falha ao enviar moedas.');
    } finally {
      setEnviando(false);
    }
  };

  const handleAdicionarCota = async () => {
    try {
      await api.professores.adicionarCota(usuario.id);
      setSucesso('Cota semestral de 1.000 moedas adicionada com sucesso ao seu saldo!');
      carregarExtrato();
    } catch (err: any) {
      setErro(err.message || 'Erro ao adicionar cota.');
    }
  };

  const totalDistribuido = extrato?.transacoes.reduce((acc, t) => acc + t.valor, 0) || 0;
  const alunosBeneficiadosCount = new Set(extrato?.transacoes.map((t) => t.alunoNome).filter(Boolean)).size || 0;

  return (
    <div>
      {/* Header com Ação de Cota */}
      <div className="page-header">
        <div>
          <h2>Painel do Professor</h2>
          <p>Distribua sua cota de moedas aos alunos com reconhecimento formal de mérito acadêmico.</p>
        </div>

        <button onClick={handleAdicionarCota} className="btn btn-secondary" title="Simula o início de um novo semestre letivo">
          <span>+ Cota Semestral (1.000 moedas)</span>
        </button>
      </div>

      {erro && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{erro}</span>
        </div>
      )}

      {sucesso && (
        <div className="alert alert-success">
          <CheckCircle2 size={20} />
          <span>{sucesso}</span>
        </div>
      )}

      {/* Modern Light KPI Row */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Cota Disponível</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', background: '#ecfdf5', padding: '2px 8px', borderRadius: '12px' }}>
              Ativa
            </span>
          </div>
          <div className="kpi-value kpi-value-emerald">
            <span>{(usuario.saldo || 0).toLocaleString('pt-BR')}</span>
            <span className="kpi-unit">moedas</span>
          </div>
          <p className="kpi-subtext">Saldo cumulativo para bonificações de mérito.</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Distribuído</span>
          </div>
          <div className="kpi-value">
            <span>{totalDistribuido.toLocaleString('pt-BR')}</span>
            <span className="kpi-unit">moedas</span>
          </div>
          <p className="kpi-subtext">Moedas concedidas aos seus alunos neste período.</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Alunos Bonificados</span>
          </div>
          <div className="kpi-value">
            <span>{alunosBeneficiadosCount}</span>
            <span className="kpi-unit">discentes</span>
          </div>
          <p className="kpi-subtext">Alunos com reconhecimento formal registrado.</p>
        </div>
      </div>

      {/* Formulário de Envio Moderno */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 className="card-title" style={{ fontSize: '1.2rem' }}>
              Reconhecer Mérito de Aluno
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
              Envie moedas virtuais justificando a participação, colaboração ou bom desempenho.
            </p>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#047857', background: '#ecfdf5', padding: '4px 12px', borderRadius: '16px', border: '1px solid #a7f3d0' }}>
            Saldo: {(usuario.saldo || 0).toLocaleString('pt-BR')} moedas
          </span>
        </div>

        <form onSubmit={handleEnviarMoedas}>
          <div className="form-group">
            <label className="form-label">Aluno Destinatário</label>
            <select
              className="form-select"
              value={form.alunoId}
              onChange={(e) => setForm({ ...form, alunoId: Number(e.target.value) })}
            >
              {alunos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome} — {a.curso} ({a.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Quantidade de Moedas a Enviar</label>
            <input
              type="number"
              min="1"
              max={usuario.saldo || 1000}
              required
              className="form-input"
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
            />

            <div className="chip-group">
              {[25, 50, 100, 200, 500].map((val) => (
                <button
                  type="button"
                  key={val}
                  className={`chip-btn ${form.valor === val ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, valor: val })}
                >
                  +{val} moedas
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Justificativa Formal do Reconhecimento</label>
            <textarea
              required
              className="form-textarea"
              placeholder="Ex: Reconhecimento por excelente participação na resolução dos estudos de caso e auxílio mútuo em sala."
              value={form.motivo}
              onChange={(e) => setForm({ ...form, motivo: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="submit"
              disabled={enviando}
              className="btn btn-primary"
              style={{ padding: '0.85rem 2.25rem', fontSize: '1rem' }}
            >
              <span>{enviando ? 'Enviando...' : 'Confirmar Envio de Moedas'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Histórico do Professor */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Histórico de Envios Realizados
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {extrato?.transacoes.length || 0} lançamentos
          </span>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Aluno Beneficiado</th>
                <th>Justificativa / Motivo</th>
                <th style={{ textAlign: 'right' }}>Moedas Enviadas</th>
              </tr>
            </thead>
            <tbody>
              {extrato?.transacoes.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      Nenhuma bonificação realizada neste semestre
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Utilize o formulário acima para bonificar alunos com justificativa de mérito.
                    </div>
                  </td>
                </tr>
              ) : (
                extrato?.transacoes.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.data).toLocaleString('pt-BR')}</td>
                    <td style={{ fontWeight: 700 }}>{t.alunoNome}</td>
                    <td style={{ color: 'var(--text-muted)', maxWidth: '350px' }}>{t.motivo}</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: '#047857' }}>
                      -{t.valor} moedas
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

