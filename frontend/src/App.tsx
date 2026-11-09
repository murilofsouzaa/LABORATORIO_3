import { useState, useEffect } from 'react';
import type { UsuarioAutenticado } from './types/api';
import { AuthModal } from './components/AuthModal';
import { AlunoDashboard } from './components/AlunoDashboard';
import { ProfessorDashboard } from './components/ProfessorDashboard';
import { EmpresaDashboard } from './components/EmpresaDashboard';

function App() {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(() => {
    const saved = localStorage.getItem('usuario_moeda');
    return saved ? JSON.parse(saved) : null;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'LOGIN' | 'CADASTRO_ALUNO' | 'CADASTRO_EMPRESA'>('LOGIN');

  const openAuth = (tab: 'LOGIN' | 'CADASTRO_ALUNO' | 'CADASTRO_EMPRESA' = 'LOGIN') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('usuario_moeda', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('usuario_moeda');
    }
  }, [usuario]);

  const handleLoginSuccess = (user: UsuarioAutenticado) => {
    setUsuario(user);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUsuario(null);
  };

  const handleUpdateSaldo = (novoSaldo: number) => {
    if (usuario) {
      setUsuario({ ...usuario, saldo: novoSaldo });
    }
  };

  return (
    <div className="app-container">
      <main className="main-content">
        {usuario ? (
          <>
            {/* Barra de Sessão Discreta */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '1.25rem',
                marginBottom: '2rem',
                borderBottom: '1px solid var(--border)',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  Moeda Estudantil
                </span>
                <span style={{ color: 'var(--border)' }}>•</span>
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  {usuario.nome}
                </span>
                <span className={`user-role-tag tag-${usuario.tipo.toLowerCase()}`}>
                  {usuario.tipo}
                </span>
                {usuario.saldo !== undefined && usuario.saldo !== null && (
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: 'var(--coin-gold-dark)',
                      background: 'var(--coin-bg)',
                      padding: '3px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--coin-border)',
                    }}
                  >
                    {usuario.saldo.toLocaleString('pt-BR')} moedas
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              >
                Sair
              </button>
            </div>

            {usuario.tipo === 'ALUNO' && (
              <AlunoDashboard usuario={usuario} onUpdateSaldo={handleUpdateSaldo} />
            )}
            {usuario.tipo === 'PROFESSOR' && (
              <ProfessorDashboard usuario={usuario} onUpdateSaldo={handleUpdateSaldo} />
            )}
            {usuario.tipo === 'EMPRESA' && (
              <EmpresaDashboard usuario={usuario} />
            )}
          </>
        ) : (
          <div style={{ padding: '2.5rem 0 1rem' }}>
            {/* Landing Hero */}
            <div
              className="hero-grid-bg"
              style={{
                textAlign: 'center',
                maxWidth: '820px',
                margin: '0 auto 3.75rem',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <h1
                style={{
                  fontSize: '3.1rem',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.15,
                  marginBottom: '1.25rem',
                  color: 'var(--text-main)',
                }}
              >
                Reconhecimento do Mérito Estudantil por <span className="text-gradient">Moeda Virtual</span>
              </h1>

              <p
                style={{
                  fontSize: '1.15rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  marginBottom: '2.25rem',
                }}
              >
                Uma economia acadêmica moderna onde professores bonificam alunos com moedas virtuais por participação e bom desempenho, e os alunos resgatam benefícios em empresas parceiras cadastradas.
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => openAuth('LOGIN')}
                  className="btn btn-primary"
                  style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
                >
                  Acessar Plataforma
                </button>
                <button
                  onClick={() => openAuth('CADASTRO_ALUNO')}
                  className="btn btn-secondary"
                  style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
                >
                  Cadastrar Novo Aluno
                </button>
              </div>
            </div>

            {/* FEATURE GRID */}
            <div className="feature-grid">
              {/* Card 1: Alunos */}
              <div className="feature-card">
                <div>
                  <span className="feature-tag feature-tag-aluno">Estudantes</span>
                  <h3 className="feature-title">Para Alunos</h3>
                  <p className="feature-desc">
                    Receba moedas pelo seu mérito e dedicação em aula, acompanhe cada movimentação no extrato e resgate benefícios em parceiros credenciados.
                  </p>
                  <ul className="feature-list">
                    <li className="feature-item">
                      <span className="feature-check">✓</span>
                      <span>Extrato com atualização de saldo em tempo real</span>
                    </li>
                    <li className="feature-item">
                      <span className="feature-check">✓</span>
                      <span>Catálogo com ofertas de parceiros credenciados</span>
                    </li>
                    <li className="feature-item">
                      <span className="feature-check">✓</span>
                      <span>Geração de cupons com envio imediato por e-mail</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => openAuth('CADASTRO_ALUNO')}
                  className="feature-btn"
                >
                  Cadastrar como Aluno
                </button>
              </div>

              {/* Card 2: Professores */}
              <div className="feature-card">
                <div>
                  <span className="feature-tag feature-tag-professor">Docentes</span>
                  <h3 className="feature-title">Para Professores</h3>
                  <p className="feature-desc">
                    Reconheça a dedicação dos discentes com envio de moedas acompanhado de justificativa formal de mérito acadêmico.
                  </p>
                  <ul className="feature-list">
                    <li className="feature-item">
                      <span className="feature-check">✓</span>
                      <span>1.000 moedas a cada início de semestre letivo</span>
                    </li>
                    <li className="feature-item">
                      <span className="feature-check">✓</span>
                      <span>Saldo cumulativo permanente sem perda de saldo</span>
                    </li>
                    <li className="feature-item">
                      <span className="feature-check">✓</span>
                      <span>Notificação automática ao aluno a cada reconhecimento</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => openAuth('LOGIN')}
                  className="feature-btn"
                >
                  Acessar Painel Docente
                </button>
              </div>

              {/* Card 3: Empresas */}
              <div className="feature-card">
                <div>
                  <span className="feature-tag feature-tag-empresa">Parceiros</span>
                  <h3 className="feature-title">Para Empresas</h3>
                  <p className="feature-desc">
                    Cadastre suas vantagens no ecossistema acadêmico, atraia estudantes universitários e valide cupons no balcão de atendimento.
                  </p>
                  <ul className="feature-list">
                    <li className="feature-item">
                      <span className="feature-check">✓</span>
                      <span>Divulgação no catálogo oficial para todos os alunos</span>
                    </li>
                    <li className="feature-item">
                      <span className="feature-check">✓</span>
                      <span>Cadastro ágil de produtos, descontos e fotos</span>
                    </li>
                    <li className="feature-item">
                      <span className="feature-check">✓</span>
                      <span>Validação rápida de cupons por código único</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => openAuth('CADASTRO_EMPRESA')}
                  className="feature-btn"
                >
                  Cadastrar Empresa Parceira
                </button>
              </div>
            </div>

            {/* SEGURANÇA E INTEGRIDADE INSTITUCIONAL */}
            <div className="system-trust-strip">
              <div className="system-trust-header">
                <h3>Transparência e Governança do Ecossistema</h3>
                <p>Estrutura segura projetada para integrar estudantes, docentes e o comércio parceiro com total rastreabilidade.</p>
              </div>
              <div className="system-trust-grid">
                <div className="system-trust-item">
                  <h4>Operações Auditáveis</h4>
                  <p>Cada transação de transferência ou resgate é registrada permanentemente, garantindo integridade de saldos sem inconsistências.</p>
                </div>
                <div className="system-trust-item">
                  <h4>Comunicação Bilateral</h4>
                  <p>Notificações automáticas por e-mail informam emissor e receptor com os dados da operação e código identificador do cupom.</p>
                </div>
                <div className="system-trust-item">
                  <h4>Conferência Presencial</h4>
                  <p>Códigos únicos de conferência garantem que cada vantagem resgatada seja validada pontualmente no balcão da empresa credenciada.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', padding: '1.75rem', marginTop: 'auto' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            <strong>Sistema de Moeda Estudantil</strong>
          </div>
          <div>
            Desenvolvido por <strong>Murilo Freitas</strong> e <strong>Letícia Figueiredo</strong> • <strong>PUC Minas</strong>
          </div>
        </div>
      </footer>

      {authModalOpen && (
        <AuthModal
          initialTab={authModalTab}
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;
