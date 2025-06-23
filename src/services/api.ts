import axios, { AxiosError } from "axios";
import type {
  Projeto,
  CasoDeTeste,
  SuiteDeTeste,
  Bug,
  ExecucaoDeTeste,
} from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@Insights:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("@Insights:token");
      localStorage.removeItem("@Insights:user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export { api };

// Projetos
export const projetosApi = {
  listar: () => api.get<Projeto[]>("/projetos"),
  obter: (id: string) => api.get<Projeto>(`/projetos/${id}`),
  criar: (projeto: Omit<Projeto, "id">) =>
    api.post<Projeto>("/projetos/createProject", projeto),
  atualizar: (id: string, projeto: Partial<Projeto>) =>
    api.put<Projeto>(`/projetos/${id}`, projeto),
  excluir: (id: string) => api.delete(`/projetos/${id}`),
};

// Casos de Teste
export const casosDeTesteApi = {
  listar: () => api.get<CasoDeTeste[]>("/casos-de-teste"),
  obter: (id: string) => api.get<CasoDeTeste>(`/casos-de-teste/${id}`),
  criar: (casoDeTeste: Omit<CasoDeTeste, "id">) =>
    api.post<CasoDeTeste>("/casos-de-teste", casoDeTeste),
  atualizar: (id: string, casoDeTeste: Partial<CasoDeTeste>) =>
    api.put<CasoDeTeste>(`/casos-de-teste/${id}`, casoDeTeste),
  excluir: (id: string) => api.delete(`/casos-de-teste/${id}`),
};

// Suites de Teste
export const suitesDeTesteApi = {
  listar: () => api.get<SuiteDeTeste[]>("/suites-de-teste"),
  obter: (id: string) => api.get<SuiteDeTeste>(`/suites-de-teste/${id}`),
  criar: (suiteDeTeste: Omit<SuiteDeTeste, "id">) =>
    api.post<SuiteDeTeste>("/suites-de-teste/create", suiteDeTeste),
  atualizar: (id: string, suiteDeTeste: Partial<SuiteDeTeste>) =>
    api.put<SuiteDeTeste>(`/suites-de-teste/${id}`, suiteDeTeste),
  excluir: (id: string) => api.delete(`/suites-de-teste/${id}`),
};

// Bugs
export const bugsApi = {
  listar: () => api.get<Bug[]>("/bugs"),
  obter: (id: string) => api.get<Bug>(`/bugs/${id}`),
  criar: (bug: Omit<Bug, "id">) => api.post<Bug>("/bugs", bug),
  atualizar: (id: string, bug: Partial<Bug>) =>
    api.put<Bug>(`/bugs/${id}`, bug),
  excluir: (id: string) => api.delete(`/bugs/${id}`),
};

// Execuções de Teste
export const execucoesApi = {
  listar: () => api.get<ExecucaoDeTeste[]>("/execucoes-de-teste"),
  obter: (id: string) => api.get<ExecucaoDeTeste>(`/execucoes-de-teste/${id}`),
  criar: (execucao: Omit<ExecucaoDeTeste, "id">) =>
    api.post<ExecucaoDeTeste>("/execucoes-de-teste", execucao),
  atualizar: (id: string, execucao: Partial<ExecucaoDeTeste>) =>
    api.put<ExecucaoDeTeste>(`/execucoes-de-teste/${id}`, execucao),
  excluir: (id: string) => api.delete(`/execucoes-de-teste/${id}`),
};

// Autenticação
export const authApi = {
  register: (nome: string, email: string, senha: string) =>
    api.post("usuarios/auth/register", { nome, email, senha }),
  login: (email: string, senha: string) =>
    api.post("usuarios/auth/login", { email, senha }),
  logout: () => api.post("/auth/logout"),
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    api.post("/auth/reset-password", { token, password }),
};
