import { useState, useEffect } from 'react';
import type { UsuarioAutenticado } from './types/api';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { AlunoDashboard } from './components/AlunoDashboard';
import { ProfessorDashboard } from './components/ProfessorDashboard';
import { EmpresaDashboard } from './components/EmpresaDashboard';
import { Coins, GraduationCap, Award, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

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
          <div style={{ padding: '2rem 0' }}>
            {/* Landing Hero */}
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#e0f2fe',
                  color: '#0369a1',
                  padding: '0.4rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                }}
              >
                <Award size={18} />
                <span>Laboratório de Desenvolvimento de Software • PUC Minas</span>
              </div>

              <h1 style={{ fontSize: '2.75rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: '1.25rem', color: 'var(--primary-dark)' }}>
                Reconhecimento do Mérito Estudantil por Moeda Virtual
              </h1>

              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
                Uma economia acadêmica onde professores bonificam alunos com moedas virtuais por participação e bom desempenho, e os alunos resgatam benefícios em empresas parceiras cadastradas.
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => setAuthModalOpen(true)} className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
                  <span>Acessar Plataforma</span>
                  <ArrowRight size={18} />
                </button>
                <button onClick={() => setAuthModalOpen(true)} className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
                  <span>Cadastrar Novo Aluno</span>
                </button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-3" style={{ marginBottom: '3.5rem' }}>
              <div className="card">
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <GraduationCap size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Para Alunos</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Receba moedas em reconhecimento por dedicação em aula, acompanhe seu saldo em tempo real no extrato e troque por descontos em mensalidades, alimentação e materiais.
                </p>
              </div>

              <div className="card">
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Coins size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Para Professores</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Receba uma cota semestral de 1.000 moedas cumulativas e distribua para seus alunos vinculando uma mensagem obrigatória de justificativa e reconhecimento.
                </p>
              </div>

              <div className="card">
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Building2 size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Para Empresas Parceiras</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Disponibilize produtos e descontos no catálogo, receba validação por e-mail e realize a conferência presencial de cupons de resgate no balcão da sua loja.
                </p>
              </div>
            </div>

            {/* Security and Integrity Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
                color: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ShieldCheck size={44} color="#38bdf8" />
                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Segurança e Rastreabilidade Transacional</h4>
                  <p style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                    Todas as operações de transferência e resgate são auditáveis, protegidas por transações ACID e com envio simultâneo de cupons criptografados.
                  </p>
                </div>
              </div>

              <button onClick={() => setAuthModalOpen(true)} className="btn btn-gold">
                Experimentar Agora
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', padding: '1.75rem 1.5rem', marginTop: 'auto' }}>
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
