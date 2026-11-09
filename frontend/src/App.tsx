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
                  onClick={() => setAuthModalOpen(true)}
                  className="btn btn-primary"
                  style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
                >
                  Acessar Plataforma
                </button>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="btn btn-secondary"
                  style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
                >
                  Cadastrar Novo Aluno
                </button>
              </div>
            </div>

            {/* BENTO GRID */}
            <div className="bento-grid">
              {/* Item 1: Alunos */}
              <div className="bento-card col-span-7">
                <div>
                  <h3 className="bento-title">Para Alunos</h3>
                  <p className="bento-desc">
                    Receba moedas em reconhecimento por dedicação em aula, acompanhe seu saldo em tempo real no extrato e troque por descontos em mensalidades, alimentação e materiais didáticos.
                  </p>
                </div>

                <div className="bento-widget">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                      SALDO DISPONÍVEL
                    </span>
                    <span
                      style={{
                        background: '#fffbeb',
                        color: '#92400e',
                        border: '1px solid #fef08a',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      250 moedas
                    </span>
                  </div>
                  <div
                    style={{
                      background: '#ffffff',
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #e6e8f2',
                    }}
                  >
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      +100 moedas • Prof. Carlos Drummond
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      "Destaque na apresentação do seminário prático de software."
                    </div>
                  </div>
                </div>
              </div>

              {/* Item 2: Professores */}
              <div className="bento-card col-span-5">
                <div>
                  <h3 className="bento-title">Para Professores</h3>
                  <p className="bento-desc">
                    Receba 1.000 moedas a cada início de semestre com saldo cumulativo e bonifique seus alunos com justificativa formal de mérito.
                  </p>
                </div>

                <div className="bento-widget" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
                  <div
                    style={{
                      fontSize: '2.1rem',
                      fontWeight: 800,
                      color: '#92400e',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.4rem',
                    }}
                  >
                    <span>1.000</span>
                    <span style={{ fontSize: '0.85rem', color: '#78350f', fontWeight: 600 }}>moedas por semestre</span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#78350f',
                      background: 'rgba(254, 243, 199, 0.85)',
                      padding: '0.55rem',
                      borderRadius: '8px',
                      border: '1px solid #fef08a',
                    }}
                  >
                    Justificativa de reconhecimento obrigatória a cada bonificação.
                  </div>
                </div>
              </div>

              {/* Item 3: Empresas Parceiras */}
              <div className="bento-card col-span-5">
                <div>
                  <h3 className="bento-title">Para Empresas Parceiras</h3>
                  <p className="bento-desc">
                    Cadastre produtos e descontos no catálogo e realize a conferência presencial de cupons de resgate no balcão.
                  </p>
                </div>

                <div className="bento-widget">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CUPOM PRESENCIAL</span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#047857',
                        background: '#ecfdf5',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        border: '1px solid #a7f3d0',
                      }}
                    >
                      VÁLIDO
                    </span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.06em', color: 'var(--primary)' }}>
                    CUPOM-6E6FACD8
                  </div>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    20% OFF em Livros • Aluno: Murilo Freitas
                  </span>
                </div>
              </div>

              {/* Item 4: Validação e Notificações */}
              <div className="bento-card bento-card-dark col-span-7">
                <div>
                  <h3 className="bento-title" style={{ color: 'white' }}>Validação e Notificações</h3>
                  <p className="bento-desc" style={{ color: '#cbd5e1' }}>
                    Controle seguro de saldos, histórico completo de movimentações e envio automático de cupons por e-mail para conferência presencial.
                  </p>
                </div>

                <div className="grid grid-cols-3" style={{ gap: '0.75rem' }}>
                  <div className="bento-widget bento-widget-dark" style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>E-mail</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Disparo automático</span>
                  </div>
                  <div className="bento-widget bento-widget-dark" style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399' }}>Código Único</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Validação presencial</span>
                  </div>
                  <div className="bento-widget bento-widget-dark" style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24' }}>Extrato</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Histórico detalhado</span>
                  </div>
                </div>
              </div>

              {/* Item 5: Instituições Parceiras */}
              <div className="col-span-12">
                <div className="bento-strip">
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                      Instituições de Ensino Superior
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Cadastro corporativo de docentes, departamentos acadêmicos e validação dos cursos matriculados.
                    </p>
                  </div>

                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="btn btn-primary"
                    style={{ padding: '0.65rem 1.4rem', fontSize: '0.875rem' }}
                  >
                    Acessar Demonstração
                  </button>
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
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;
