import React from 'react';
import type { UsuarioAutenticado } from '../types/api';
import { Coins, LogOut, User, GraduationCap, Building2 } from 'lucide-react';

interface NavbarProps {
  usuario: UsuarioAutenticado | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ usuario, onLogout, onOpenAuth }) => {
  const getRoleBadgeClass = (tipo: string) => {
    switch (tipo) {
      case 'ALUNO': return 'tag-aluno';
      case 'PROFESSOR': return 'tag-professor';
      case 'EMPRESA': return 'tag-empresa';
      default: return '';
    }
  };

  const getRoleIcon = (tipo: string) => {
    switch (tipo) {
      case 'ALUNO': return <GraduationCap size={16} />;
      case 'PROFESSOR': return <User size={16} />;
      case 'EMPRESA': return <Building2 size={16} />;
      default: return null;
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="navbar-logo">
            <Coins size={24} />
          </div>
          <div className="navbar-title">
            <h1>Moeda Estudantil</h1>
            <p>PUC Minas • Reconhecimento de Mérito</p>
          </div>
        </div>

        <div className="navbar-actions">
          {usuario ? (
            <>
              {usuario.saldo !== undefined && usuario.saldo !== null && (
                <div className="wallet-badge" title="Saldo atual de moedas">
                  <Coins size={18} />
                  <span>{usuario.saldo.toLocaleString('pt-BR')} moedas</span>
                </div>
              )}

              <div className="user-badge">
                {getRoleIcon(usuario.tipo)}
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{usuario.nome}</span>
                <span className={`user-role-tag ${getRoleBadgeClass(usuario.tipo)}`}>
                  {usuario.tipo}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                title="Desconectar da conta"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </>
          ) : (
            <button onClick={onOpenAuth} className="btn btn-primary">
              <User size={18} />
              <span>Acessar Conta</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
