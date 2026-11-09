export type TipoUtilizador = 'ALUNO' | 'PROFESSOR' | 'EMPRESA';
export type TipoTransacao = 'ENVIO_MOEDAS' | 'RESGATE_VANTAGEM';

export interface UsuarioAutenticado {
  id: number;
  login: string;
  nome: string;
  tipo: TipoUtilizador;
  saldo?: number | null;
}

export interface Instituicao {
  id: number;
  nome: string;
}

export interface Aluno {
  id: number;
  login: string;
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  endereco: string;
  curso: string;
  saldo: number;
  instituicaoNome?: string;
}

export interface Professor {
  id: number;
  login: string;
  nome: string;
  cpf: string;
  departamento: string;
  saldo: number;
  instituicaoNome?: string;
}

export interface EmpresaParceira {
  id: number;
  login: string;
  nome: string;
  email: string;
}

export interface Vantagem {
  id: number;
  descricao: string;
  foto: string;
  custo: number;
  empresaId: number;
  empresaNome: string;
}

export interface Transacao {
  id: number;
  valor: number;
  motivo: string;
  data: string;
  tipo: TipoTransacao;
  remetenteNome?: string;
  alunoNome?: string;
  vantagemDescricao?: string;
  codigoCupom?: string;
}

export interface Extrato {
  saldo: number;
  transacoes: Transacao[];
}
