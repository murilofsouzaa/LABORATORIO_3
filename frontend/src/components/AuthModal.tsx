import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Instituicao, UsuarioAutenticado } from '../types/api';
import { X, LogIn, UserPlus, Building2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  initialTab?: 'LOGIN' | 'CADASTRO_ALUNO' | 'CADASTRO_EMPRESA';
  onClose: () => void;
  onLoginSuccess: (user: UsuarioAutenticado) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialTab = 'LOGIN', onClose, onLoginSuccess }) => {
  const [tab, setTab] = useState<'LOGIN' | 'CADASTRO_ALUNO' | 'CADASTRO_EMPRESA'>(initialTab);
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Login form state
  const [loginField, setLoginField] = useState('');
  const [senhaField, setSenhaField] = useState('');

  // Aluno form state
  const [alunoForm, setAlunoForm] = useState({
    login: '',
    senha: '',
    nome: '',
    email: '',
    cpf: '',
    rg: '',
    endereco: '',
    curso: 'Engenharia de Software',
    instituicaoId: 1,
  });

  // Empresa form state
  const [empresaForm, setEmpresaForm] = useState({
    login: '',
    senha: '',
    nome: '',
    email: '',
  });

  useEffect(() => {
    api.instituicoes.listarTodas()
      .then(setInstituicoes)
      .catch((err) => console.error('Erro ao carregar instituições:', err));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      const user = await api.auth.login(loginField, senhaField);
      onLoginSuccess(user);
    } catch (err: any) {
      setErro(err.message || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (login: string, pass: string) => {
    setLoginField(login);
    setSenhaField(pass);
    setLoading(true);
    setErro(null);
    try {
      const user = await api.auth.login(login, pass);
      onLoginSuccess(user);
    } catch (err: any) {
      setErro(err.message || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  const handleCadastroAluno = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      await api.alunos.cadastrar({
        ...alunoForm,
        instituicaoId: Number(alunoForm.instituicaoId),
      });
      setSucesso('Cadastro de aluno realizado com sucesso! Efetue login para acessar.');
      setTab('LOGIN');
      setLoginField(alunoForm.login);
      setSenhaField(alunoForm.senha);
    } catch (err: any) {
      setErro(err.message || 'Erro ao cadastrar aluno.');
    } finally {
      setLoading(false);
    }
  };

  const handleCadastroEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      await api.empresas.cadastrar(empresaForm);
      setSucesso('Empresa parceira cadastrada com sucesso! Efetue login para gerenciar vantagens.');
      setTab('LOGIN');
      setLoginField(empresaForm.login);
      setSenhaField(empresaForm.senha);
    } catch (err: any) {
      setErro(err.message || 'Erro ao cadastrar empresa parceira.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          <X size={20} />
        </button>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'LOGIN' ? 'active' : ''}`}
            onClick={() => { setTab('LOGIN'); setErro(null); }}
          >
            Entrar
          </button>
          <button
            className={`auth-tab ${tab === 'CADASTRO_ALUNO' ? 'active' : ''}`}
            onClick={() => { setTab('CADASTRO_ALUNO'); setErro(null); }}
          >
            Novo Aluno
          </button>
          <button
            className={`auth-tab ${tab === 'CADASTRO_EMPRESA' ? 'active' : ''}`}
            onClick={() => { setTab('CADASTRO_EMPRESA'); setErro(null); }}
          >
            Nova Empresa
          </button>
        </div>

        {erro && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{erro}</span>
          </div>
        )}

        {sucesso && (
          <div className="alert alert-success">
            <span>{sucesso}</span>
          </div>
        )}

        {tab === 'LOGIN' && (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Login ou Usuário</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Ex: prof.carlos ou aluno.murilo"
                value={loginField}
                onChange={(e) => setLoginField(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="Digite sua senha"
                value={senhaField}
                onChange={(e) => setSenhaField(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <LogIn size={18} />
              <span>{loading ? 'Entrando...' : 'Entrar no Sistema'}</span>
            </button>

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                ⚡ Acesso Rápido de Demonstração (Senha: 123)
              </span>
              <div className="quick-login-grid">
                <button type="button" className="btn-quick" onClick={() => handleQuickLogin('prof.carlos', '123')}>
                  <strong>Prof. Carlos</strong>
                  <span>Professor (1000 moedas)</span>
                </button>
                <button type="button" className="btn-quick" onClick={() => handleQuickLogin('profa.milena', '123')}>
                  <strong>Profa. Milena</strong>
                  <span>Professora (1000 moedas)</span>
                </button>
                <button type="button" className="btn-quick" onClick={() => handleQuickLogin('aluno.murilo', '123')}>
                  <strong>Murilo Freitas</strong>
                  <span>Aluno (250 moedas)</span>
                </button>
                <button type="button" className="btn-quick" onClick={() => handleQuickLogin('aluna.leticia', '123')}>
                  <strong>Letícia Figueiredo</strong>
                  <span>Aluna (300 moedas)</span>
                </button>
                <button type="button" className="btn-quick" onClick={() => handleQuickLogin('livraria', '123')}>
                  <strong>Livraria Saber</strong>
                  <span>Empresa Parceira</span>
                </button>
                <button type="button" className="btn-quick" onClick={() => handleQuickLogin('restaurante', '123')}>
                  <strong>Restaurante Campus</strong>
                  <span>Empresa Parceira</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {tab === 'CADASTRO_ALUNO' && (
          <form onSubmit={handleCadastroAluno}>
            <div className="form-group">
              <label className="form-label">Nome Completo</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Ex: João Silva"
                value={alunoForm.nome}
                onChange={(e) => setAlunoForm({ ...alunoForm, nome: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2" style={{ gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="joao@sga.pucminas.br"
                  value={alunoForm.email}
                  onChange={(e) => setAlunoForm({ ...alunoForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">CPF</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="000.000.000-00"
                  value={alunoForm.cpf}
                  onChange={(e) => setAlunoForm({ ...alunoForm, cpf: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">RG</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="MG-00.000.000"
                  value={alunoForm.rg}
                  onChange={(e) => setAlunoForm({ ...alunoForm, rg: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Curso</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ex: Engenharia de Software"
                  value={alunoForm.curso}
                  onChange={(e) => setAlunoForm({ ...alunoForm, curso: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Endereço Residencial</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Rua, Número, Bairro, Cidade"
                value={alunoForm.endereco}
                onChange={(e) => setAlunoForm({ ...alunoForm, endereco: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Instituição de Ensino</label>
              <select
                className="form-select"
                value={alunoForm.instituicaoId}
                onChange={(e) => setAlunoForm({ ...alunoForm, instituicaoId: Number(e.target.value) })}
              >
                {instituicoes.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Login Desejado</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="aluno.usuario"
                  value={alunoForm.login}
                  onChange={(e) => setAlunoForm({ ...alunoForm, login: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Senha</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="Senha segura"
                  value={alunoForm.senha}
                  onChange={(e) => setAlunoForm({ ...alunoForm, senha: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
              <UserPlus size={18} />
              <span>{loading ? 'Cadastrando...' : 'Finalizar Cadastro de Aluno'}</span>
            </button>
          </form>
        )}

        {tab === 'CADASTRO_EMPRESA' && (
          <form onSubmit={handleCadastroEmpresa}>
            <div className="form-group">
              <label className="form-label">Nome Fantasia / Razão Social</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Ex: Cafeteria Central"
                value={empresaForm.nome}
                onChange={(e) => setEmpresaForm({ ...empresaForm, nome: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">E-mail Corporativo</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="contato@empresa.com.br"
                value={empresaForm.email}
                onChange={(e) => setEmpresaForm({ ...empresaForm, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2" style={{ gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Login</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="empresa.login"
                  value={empresaForm.login}
                  onChange={(e) => setEmpresaForm({ ...empresaForm, login: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Senha</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="Senha"
                  value={empresaForm.senha}
                  onChange={(e) => setEmpresaForm({ ...empresaForm, senha: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
              <Building2 size={18} />
              <span>{loading ? 'Cadastrando...' : 'Cadastrar Empresa Parceira'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
