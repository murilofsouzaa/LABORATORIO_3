import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { UsuarioAutenticado, Vantagem, Transacao } from '../types/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface EmpresaDashboardProps {
  usuario: UsuarioAutenticado;
}

export const EmpresaDashboard: React.FC<EmpresaDashboardProps> = ({ usuario }) => {
  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Form de cadastro de vantagem
  const [form, setForm] = useState({
    descricao: '',
    foto: '',
    custo: 100,
  });
  const [cadastrando, setCadastrando] = useState(false);

  // Validação de cupom presencial
  const [codigoCupom, setCodigoCupom] = useState('');
  const [validando, setValidando] = useState(false);
  const [cupomValidado, setCupomValidado] = useState<Transacao | null>(null);

  const carregarVantagens = () => {
    api.empresas.listarVantagens(usuario.id)
      .then(setVantagens)
      .catch((err) => console.error('Erro ao carregar vantagens da empresa:', err));
  };

  useEffect(() => {
    carregarVantagens();
  }, [usuario.id]);

  const handleCadastrarVantagem = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);
    setCadastrando(true);
    try {
      await api.empresas.cadastrarVantagem(usuario.id, {
        descricao: form.descricao,
        foto: form.foto || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
        custo: Number(form.custo),
      });
      setSucesso('Vantagem cadastrada com sucesso e disponibilizada para os alunos!');
      setForm({ descricao: '', foto: '', custo: 100 });
      carregarVantagens();
    } catch (err: any) {
      setErro(err.message || 'Falha ao cadastrar vantagem.');
    } finally {
      setCadastrando(false);
    }
  };

  const handleValidarCupom = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCupomValidado(null);
    setValidando(true);
    try {
      const t = await api.empresas.validarCupom(codigoCupom.trim());
      setCupomValidado(t);
    } catch (err: any) {
      setErro(err.message || 'Cupom não localizado ou inválido.');
    } finally {
      setValidando(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Painel da Empresa Parceira</h2>
          <p>Cadastre novos produtos e descontos e realize a conferência presencial de cupons de resgate.</p>
        </div>
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
            <span className="kpi-title">Vantagens no Catálogo</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', background: '#ecfdf5', padding: '2px 8px', borderRadius: '12px' }}>
              Ativo
            </span>
          </div>
          <div className="kpi-value kpi-value-emerald">
            <span>{vantagens.length}</span>
            <span className="kpi-unit">itens</span>
          </div>
          <p className="kpi-subtext">Benefícios disponíveis para resgate pelos alunos.</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Status da Empresa</span>
          </div>
          <div className="kpi-value" style={{ fontSize: '1.75rem' }}>
            <span>Credenciada</span>
          </div>
          <p className="kpi-subtext">Habilitada para conferência presencial de cupons.</p>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ marginBottom: '2.5rem' }}>
        {/* Formulário de Cadastro de Vantagens */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              Cadastrar Nova Vantagem
            </h3>
          </div>

          <form onSubmit={handleCadastrarVantagem}>
            <div className="form-group">
              <label className="form-label">Descrição do Produto ou Desconto</label>
              <textarea
                required
                className="form-textarea"
                placeholder="Ex: 25% de desconto no almoço executivo ou combo de lanche com bebida."
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">URL da Foto / Imagem do Produto</label>
              <input
                type="url"
                required
                className="form-input"
                placeholder="https://exemplo.com/foto.jpg"
                value={form.foto}
                onChange={(e) => setForm({ ...form, foto: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Custo em Moedas Estudantis</label>
              <input
                type="number"
                min="1"
                required
                className="form-input"
                value={form.custo}
                onChange={(e) => setForm({ ...form, custo: Number(e.target.value) })}
              />
            </div>

            <button type="submit" disabled={cadastrando} className="btn btn-primary" style={{ width: '100%' }}>
              <span>{cadastrando ? 'Salvando...' : 'Publicar Vantagem no Catálogo'}</span>
            </button>
          </form>
        </div>

        {/* Validador de Cupom Presencial */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              Conferência Presencial de Cupom
            </h3>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Digite o código alfanumérico apresentado pelo aluno no balcão para validar a autenticidade da troca antes de entregar o benefício.
          </p>

          <form onSubmit={handleValidarCupom}>
            <div className="form-group">
              <label className="form-label">Código do Cupom</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Ex: CUPOM-6E6FACD8"
                value={codigoCupom}
                onChange={(e) => setCodigoCupom(e.target.value.toUpperCase())}
              />
            </div>

            <button type="submit" disabled={validando} className="btn btn-secondary" style={{ width: '100%' }}>
              <span>{validando ? 'Validando...' : 'Verificar Cupom'}</span>
            </button>
          </form>

          {cupomValidado && (
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontWeight: 800, marginBottom: '0.5rem' }}>
                <CheckCircle2 size={20} />
                <span>CUPOM VÁLIDO E AUTÊNTICO!</span>
              </div>
              <p style={{ fontSize: '0.9rem', margin: '0.25rem 0' }}>
                <strong>Aluno:</strong> {cupomValidado.alunoNome}
              </p>
              <p style={{ fontSize: '0.9rem', margin: '0.25rem 0' }}>
                <strong>Item Resgatado:</strong> {cupomValidado.motivo}
              </p>
              <p style={{ fontSize: '0.9rem', margin: '0.25rem 0' }}>
                <strong>Data do Resgate:</strong> {new Date(cupomValidado.data).toLocaleString('pt-BR')}
              </p>
              <p style={{ fontSize: '0.9rem', margin: '0.25rem 0', color: '#16a34a', fontWeight: 700 }}>
                Status: Pago em moedas ({cupomValidado.valor} moedas debitadas). Pode liberar o benefício.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Catálogo das Vantagens Cadastradas pela Empresa */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
          Vantagens Ofertadas por {usuario.nome}
        </h3>

        {vantagens.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Nenhuma vantagem cadastrada ainda. Utilize o formulário acima para cadastrar seus produtos ou descontos.
          </div>
        ) : (
          <div className="grid grid-cols-3">
            {vantagens.map((v) => (
              <div key={v.id} className="vantagem-card">
                <div className="vantagem-img-container">
                  <img src={v.foto} alt={v.descricao} className="vantagem-img" />
                  <div className="vantagem-price-badge">
                    <span>{v.custo} moedas</span>
                  </div>
                </div>

                <div className="vantagem-body">
                  <p className="vantagem-desc">{v.descricao}</p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Ativa no catálogo geral dos alunos
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
