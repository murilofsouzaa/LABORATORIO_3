import type {
  UsuarioAutenticado,
  Instituicao,
  Aluno,
  Professor,
  EmpresaParceira,
  Vantagem,
  Extrato,
  Transacao,
} from '../types/api';

const API_BASE_URL = 'http://localhost:8080/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      let errorMessage = `Erro ${response.status}: ${response.statusText}`;
      try {
        const errJson = await response.json();
        if (errJson.message) {
          errorMessage = errJson.message;
        } else if (errJson.errors) {
          errorMessage = Object.values(errJson.errors).join(', ');
        }
      } catch {
        // fallback
      }
      throw new Error(errorMessage);
    }
    if (response.status === 204) {
      return {} as T;
    }
    return await response.json();
  } catch (error: any) {
    console.error(`Erro na requisição ${url}:`, error);
    throw error;
  }
}

export const api = {
  auth: {
    login: (login: string, senha: string) =>
      request<UsuarioAutenticado>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ login, senha }),
      }),
  },

  instituicoes: {
    listarTodas: () => request<Instituicao[]>('/instituicoes'),
  },

  alunos: {
    cadastrar: (data: {
      login: string;
      senha: string;
      nome: string;
      email: string;
      cpf: string;
      rg: string;
      endereco: string;
      curso: string;
      instituicaoId: number;
    }) =>
      request<Aluno>('/alunos', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    listarTodos: () => request<Aluno[]>('/alunos'),
    buscarPorId: (id: number) => request<Aluno>(`/alunos/${id}`),
    consultarExtrato: (id: number) => request<Extrato>(`/alunos/${id}/extrato`),
    resgatarVantagem: (alunoId: number, vantagemId: number) =>
      request<Transacao>(`/alunos/${alunoId}/resgatar/${vantagemId}`, {
        method: 'POST',
      }),
  },

  professores: {
    listarTodos: () => request<Professor[]>('/professores'),
    buscarPorId: (id: number) => request<Professor>(`/professores/${id}`),
    consultarExtrato: (id: number) => request<Extrato>(`/professores/${id}/extrato`),
    enviarMoedas: (
      professorId: number,
      data: { alunoId: number; valor: number; motivo: string }
    ) =>
      request<Transacao>(`/professores/${professorId}/enviar-moedas`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    adicionarCota: (professorId: number) =>
      request<void>(`/professores/${professorId}/adicionar-cota`, {
        method: 'POST',
      }),
  },

  empresas: {
    cadastrar: (data: {
      login: string;
      senha: string;
      nome: string;
      email: string;
    }) =>
      request<EmpresaParceira>('/empresas', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    listarTodas: () => request<EmpresaParceira[]>('/empresas'),
    buscarPorId: (id: number) => request<EmpresaParceira>(`/empresas/${id}`),
    cadastrarVantagem: (
      empresaId: number,
      data: { descricao: string; foto: string; custo: number }
    ) =>
      request<Vantagem>(`/empresas/${empresaId}/vantagens`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    listarVantagens: (empresaId: number) =>
      request<Vantagem[]>(`/empresas/${empresaId}/vantagens`),
    validarCupom: (codigoCupom: string) =>
      request<Transacao>(`/empresas/validar-cupom/${codigoCupom}`),
  },

  vantagens: {
    listarTodas: () => request<Vantagem[]>('/vantagens'),
    remover: (id: number) =>
      request<void>(`/vantagens/${id}`, { method: 'DELETE' }),
  },
};
