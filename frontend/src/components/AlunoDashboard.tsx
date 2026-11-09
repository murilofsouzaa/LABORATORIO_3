import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { UsuarioAutenticado, Vantagem, Extrato, Transacao } from '../types/api';
import { AlertCircle } from 'lucide-react';
import { CouponModal } from './CouponModal';

interface AlunoDashboardProps {
  usuario: UsuarioAutenticado;
  onUpdateSaldo: (novoSaldo: number) => void;
}

export const AlunoDashboard: React.FC<AlunoDashboardProps> = ({ usuario, onUpdateSaldo }) => {
  const [tab, setTab] = useState<'CATALOGO' | 'EXTRATO'>('CATALOGO');
  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [extrato, setExtrato] = useState<Extrato | null>(null);
  
  const [resgatandoId, setResgatandoId] = useState<number | null>(null);
  const [transacaoResgate, setTransacaoResgate] = useState<Transacao | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const carregarVantagens = () => {
    api.vantagens.listarTodas()
      .then(setVantagens)
      .catch((err) => console.error('Erro ao listar vantagens:', err));
  };

  const carregarExtrato = () => {
    api.alunos.consultarExtrato(usuario.id)
      .then((res) => {
        setExtrato(res);
        onUpdateSaldo(res.saldo);
      })
      .catch((err) => console.error('Erro ao consultar extrato:', err))
      ;
  };

  useEffect(() => {
    carregarVantagens();
    carregarExtrato();
  }, [usuario.id]);

  const handleResgatar = async (vantagem: Vantagem) => {
    if ((usuario.saldo || 0) < vantagem.custo) {
      setErro(`Saldo insuficiente! Você possui ${usuario.saldo || 0} moedas, mas esta vantagem requer ${vantagem.custo} moedas.`);
      return;
    }

    setErro(null);
    setResgatandoId(vantagem.id);
    try {
      const res = await api.alunos.resgatarVantagem(usuario.id, vantagem.id);
      setTransacaoResgate(res);
      carregarExtrato(); // atualiza saldo e extrato
    } catch (err: any) {
      setErro(err.message || 'Falha ao efetuar resgate.');
    } finally {
      setResgatandoId(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Área do Aluno</h2>
          <p>Consulte seu saldo de mérito, troque moedas por vantagens e acompanhe seu extrato.</p>
        </div>

        <div className="auth-tabs" style={{ margin: 0 }}>
          <button
            className={`auth-tab ${tab === 'CATALOGO' ? 'active' : ''}`}
            onClick={() => setTab('CATALOGO')}
          >
            Catálogo de Vantagens
          </button>
          <button
            className={`auth-tab ${tab === 'EXTRATO' ? 'active' : ''}`}
            onClick={() => { setTab('EXTRATO'); carregarExtrato(); }}
          >
            Meu Extrato
          </button>
        </div>
      </div>

      {erro && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{erro}</span>
        </div>
      )}

      {/* Modern Light KPI Row */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Saldo Disponível</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', background: '#ecfdf5', padding: '2px 8px', borderRadius: '12px' }}>
              Carteira
            </span>
          </div>
          <div className="kpi-value kpi-value-emerald">
            <span>{(usuario.saldo || 0).toLocaleString('pt-BR')}</span>
            <span className="kpi-unit">moedas</span>
          </div>
          <p className="kpi-subtext">Disponível para troca imediata por produtos e descontos.</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Catálogo Ativo</span>
          </div>
          <div className="kpi-value">
            <span>{vantagens.length}</span>
            <span className="kpi-unit">vantagens</span>
          </div>
          <p className="kpi-subtext">Opções cadastradas pelas empresas parceiras.</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total de Resgates</span>
          </div>
          <div className="kpi-value">
            <span>{extrato?.transacoes.filter((t) => t.tipo === 'RESGATE_VANTAGEM').length || 0}</span>
            <span className="kpi-unit">cupons</span>
          </div>
          <p className="kpi-subtext">Benefícios trocados desde o ingresso na plataforma.</p>
        </div>
      </div>

      {tab === 'CATALOGO' && (
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            Vantagens Disponíveis para Troca
          </h3>

          <div className="grid grid-cols-3">
            {vantagens.map((v) => (
              <div key={v.id} className="vantagem-card">
                <div className="vantagem-img-container">
                  <img
                    src={v.foto}
                    alt={v.descricao}
                    className="vantagem-img"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600';
                    }}
                  />
                  <div className="vantagem-price-badge">
                    <span>{v.custo} moedas</span>
                  </div>
                </div>

                <div className="vantagem-body">
                  <span className="vantagem-empresa">{v.empresaNome}</span>
                  <p className="vantagem-desc">{v.descricao}</p>

                  <button
                    onClick={() => handleResgatar(v)}
                    disabled={resgatandoId === v.id}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: 'auto' }}
                  >
                    <span>{resgatandoId === v.id ? 'Processando...' : 'Resgatar Vantagem'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'EXTRATO' && (
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            Histórico de Transações
          </h3>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Data</th>
                  <th>Origem / Detalhes</th>
                  <th>Justificativa / Motivo</th>
                  <th>Cupom</th>
                  <th style={{ textAlign: 'right' }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {extrato?.transacoes.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Nenhuma transação registrada até o momento.
                    </td>
                  </tr>
                ) : (
                  extrato?.transacoes.map((t) => (
                    <tr key={t.id}>
                      <td>
                        {t.tipo === 'ENVIO_MOEDAS' ? (
                          <span style={{ color: '#16a34a', fontWeight: 700 }}>
                            + Recebimento
                          </span>
                        ) : (
                          <span style={{ color: '#dc2626', fontWeight: 700 }}>
                            - Resgate
                          </span>
                        )}
                      </td>
                      <td>{new Date(t.data).toLocaleString('pt-BR')}</td>
                      <td>
                        {t.tipo === 'ENVIO_MOEDAS'
                          ? `Prof. ${t.remetenteNome || 'Docente'}`
                          : t.vantagemDescricao}
                      </td>
                      <td style={{ maxWidth: '280px', color: 'var(--text-muted)' }}>{t.motivo}</td>
                      <td>
                        {t.codigoCupom ? (
                          <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '0.8rem' }}>
                            {t.codigoCupom}
                          </span>
                        ) : '-'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: t.tipo === 'ENVIO_MOEDAS' ? '#16a34a' : '#dc2626' }}>
                        {t.tipo === 'ENVIO_MOEDAS' ? `+${t.valor}` : `-${t.valor}`} moedas
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {transacaoResgate && (
        <CouponModal
          transacao={transacaoResgate}
          onClose={() => setTransacaoResgate(null)}
        />
      )}
    </div>
  );
};
