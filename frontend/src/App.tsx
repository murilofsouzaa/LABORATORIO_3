import { useState, useEffect } from 'react';
import type { UsuarioAutenticado } from './types/api';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { AlunoDashboard } from './components/AlunoDashboard';
import { ProfessorDashboard } from './components/ProfessorDashboard';
import { EmpresaDashboard } from './components/EmpresaDashboard';
import { Coins, GraduationCap, Award, Building2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

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
      <Navbar
        usuario={usuario}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <main className="main-content">
        {usuario ? (
          <>
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
          <div style={{ padding: '1rem 0 2rem' }}>
            {/* Landing Hero */}
            <div className="hero-grid-bg" style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 3.25rem', position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#ede9fe',
                  color: '#6d28d9',
                  border: '1px solid #ddd6fe',
                  padding: '0.45rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                  boxShadow: '0 2px 8px rgba(109, 40, 217, 0.08)',
                }}
              >
                <Sparkles size={16} />
                <span>Laboratório de Desenvolvimento de Software • PUC Minas</span>
              </div>

              <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
                Reconhecimento do Mérito Estudantil por <span className="text-gradient">Moeda Virtual</span>
              </h1>

              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2.25rem' }}>
                Uma economia acadêmica moderna onde professores bonificam alunos com moedas virtuais por participação e bom desempenho, e os alunos resgatam benefícios em empresas parceiras cadastradas.
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => setAuthModalOpen(true)} className="btn btn-primary" style={{ padding: '0.85rem 1.85rem', fontSize: '1rem' }}>
                  <span>Acessar Plataforma</span>
                  <ArrowRight size={18} />
                </button>
                <button onClick={() => setAuthModalOpen(true)} className="btn btn-secondary" style={{ padding: '0.85rem 1.85rem', fontSize: '1rem' }}>
                  <span>Cadastrar Novo Aluno</span>
                </button>
              </div>
            </div>

            {/* BENTO GRID REFACTORED */}
            <div className="bento-grid">
              {/* Item 1: Alunos (col-span-7) */}
              <div className="bento-card col-span-7">
                <div>
                  <div className="bento-pill pill-aluno">
                    <GraduationCap size={14} />
                    <span>Mérito & Vantagens</span>
                  </div>
                  <h3 className="bento-title">Para Alunos</h3>
                  <p className="bento-desc">
                    Receba moedas em reconhecimento por dedicação em aula, acompanhe seu saldo em tempo real no extrato e troque por descontos em mensalidades, alimentação e materiais.
                  </p>
                </div>

                <div className="bento-widget">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                      CARTEIRA DIGITAL DE MÉRITO
                    </span>
                    <span style={{ background: '#fffbeb', color: '#92400e', border: '1px solid #fef08a', padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
                      ⭐ 250 moedas
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: '#ffffff', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e6e8f2' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ede9fe', color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Coins size={20} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        +100 moedas recebidas • Prof. Carlos Drummond
                      </div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        "Destaque na apresentação do seminário prático de software."
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Item 2: Professores (col-span-5) */}
              <div className="bento-card col-span-5">
                <div>
                  <div className="bento-pill pill-professor">
                    <Coins size={14} />
                    <span>Cota Semestral</span>
                  </div>
                  <h3 className="bento-title">Para Professores</h3>
                  <p className="bento-desc">
                    Receba 1.000 moedas a cada início de semestre com saldo cumulativo e bonifique seus alunos.
                  </p>
                </div>

                <div className="bento-widget" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
                  <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Coins size={28} />
                    <span>1.000</span>
                    <span style={{ fontSize: '0.85rem', color: '#78350f', fontWeight: 600 }}>moedas / semestre</span>
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#78350f', background: 'rgba(254, 243, 199, 0.85)', padding: '0.55rem', borderRadius: '8px', border: '1px solid #fef08a' }}>
                    ⚠️ Justificativa formal de reconhecimento obrigatória a cada transferência.
                  </div>
                </div>
              </div>

              {/* Item 3: Empresas Parceiras (col-span-5) */}
              <div className="bento-card col-span-5">
                <div>
                  <div className="bento-pill pill-empresa">
                    <Building2 size={14} />
                    <span>Rede de Benefícios</span>
                  </div>
                  <h3 className="bento-title">Para Empresas Parceiras</h3>
                  <p className="bento-desc">
                    Cadastre produtos e descontos no catálogo e receba o código de cupom para conferência presencial no balcão.
                  </p>
                </div>

                <div className="bento-widget">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CUPOM PRESENCIAL</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', background: '#ecfdf5', padding: '2px 8px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                      ✅ VÁLIDO
                    </span>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.06em', color: 'var(--primary)' }}>
                    CUPOM-6E6FACD8
                  </div>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    Item: 20% OFF em Livros • Aluno: Murilo Freitas
                  </span>
                </div>
              </div>

              {/* Item 4: Segurança e Arquitetura MVC (col-span-7) */}
              <div className="bento-card bento-card-dark col-span-7">
                <div>
                  <div className="bento-pill pill-dark">
                    <ShieldCheck size={14} />
                    <span>Arquitetura MVC & Segurança ACID</span>
                  </div>
                  <h3 className="bento-title" style={{ color: 'white' }}>Rastreabilidade e Integridade Financeira</h3>
                  <p className="bento-desc" style={{ color: '#cbd5e1' }}>
                    Construído com base no padrão MVC estrito, banco relacional com transações atômicas e disparo simultâneo de cupons por e-mail para conferência bilateral.
                  </p>
                </div>

                <div className="grid grid-cols-3" style={{ gap: '0.75rem' }}>
                  <div className="bento-widget bento-widget-dark" style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8' }}>100%</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Transações ACID</span>
                  </div>
                  <div className="bento-widget bento-widget-dark" style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399' }}>Zero</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Gasto Duplo</span>
                  </div>
                  <div className="bento-widget bento-widget-dark" style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fbbf24' }}>E-mail</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Notificação Real</span>
                  </div>
                </div>
              </div>

              {/* Item 5: Instituições Parceiras (col-span-12) */}
              <div className="col-span-12">
                <div className="bento-strip">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)' }}>
                      <Award size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        Integração com Instituições de Ensino Superior (PUC Minas)
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Pré-cadastro corporativo de docentes, departamentos acadêmicos e validação dos cursos matriculados.
                      </p>
                    </div>
                  </div>

                  <button onClick={() => setAuthModalOpen(true)} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>
                    Acessar Demonstração
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', padding: '1.85rem 1.75rem', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div>
            <strong>Sistema de Moeda Estudantil</strong> • Laboratório de Desenvolvimento de Software / Projeto de Software (Lab 3)
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
