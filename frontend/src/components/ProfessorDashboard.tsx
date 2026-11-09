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
      .catch((err) => console.error('Erro ao consultar extrato do professor:', err))
      ;
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

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Área do Professor</h2>
          <p>Distribua sua cota de moedas aos alunos com justificativa formal de mérito acadêmico.</p>
        </div>

        <button onClick={handleAdicionarCota} className="btn btn-gold" title="Simula o início de um novo semestre letivo">
          <span>+1.000 Moedas (Novo Semestre)</span>
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

      <div className="grid grid-cols-2" style={{ marginBottom: '2rem' }}>
        {/* Card de Cota */}
        <div className="stat-card">
          <div className="stat-title">Cota Semestral Disponível</div>
          <div className="stat-value">
            <span>{(usuario.saldo || 0).toLocaleString('pt-BR')}</span>
            <span style={{ fontSize: '1.25rem', color: '#cbd5e1', fontWeight: 500 }}>moedas</span>
          </div>
          <div className="stat-subtext">
            O saldo é acumulável entre semestres: moedas não distribuídas permanecem na sua conta.
          </div>
        </div>

        {/* Formulário de Envio */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              Enviar Moedas para Aluno
            </h3>
          </div>

          <form onSubmit={handleEnviarMoedas}>
            <div className="form-group">
              <label className="form-label">Selecione o Aluno Destinatário</label>
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
              <label className="form-label">Quantidade de Moedas</label>
              <input
                type="number"
                min="1"
                max={usuario.saldo || 1000}
                required
                className="form-input"
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mensagem Obrigatória de Justificação</label>
              <textarea
                required
                className="form-textarea"
                placeholder="Ex: Reconhecimento por excelente participação no projeto prático e liderança em equipe."
                value={form.motivo}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
              />
            </div>

            <button type="submit" disabled={enviando} className="btn btn-primary" style={{ width: '100%' }}>
              <span>{enviando ? 'Processando envio...' : 'Confirmar e Enviar Moedas'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Histórico do Professor */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
          Histórico de Envios Realizados
        </h3>

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
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Você ainda não realizou transferências de moedas neste semestre.
                  </td>
                </tr>
              ) : (
                extrato?.transacoes.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.data).toLocaleString('pt-BR')}</td>
                    <td style={{ fontWeight: 600 }}>{t.alunoNome}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{t.motivo}</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: '#16a34a' }}>
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
