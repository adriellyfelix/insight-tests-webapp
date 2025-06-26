export interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  status: string;
  versao: string;
  metadados?: Record<string, any>;
}

export interface CasoDeTeste {
  id: string;
  titulo: string;
  descricao: string;
  preCondicoes?: string;
  passos: string[];
  resultadoEsperado: string;
  prioridade: "baixa" | "media" | "alta" | "critica";
  tipo: "funcional" | "regressao" | "performance" | "seguranca" | "usabilidade";
  ativo: boolean;
  projeto_id: string;
  suite_id: string;
  versao?: string;
  metadados?: Record<string, any>;
}

export interface SuiteDeTeste {
  id: string;
  nome: string;
  descricao?: string;
  tipo: "funcional" | "regressao" | "performance" | "seguranca" | "usabilidade";
  ativa: boolean;
  projeto_id: string;
  versao?: string;
  metadados?: Record<string, any>;
}

export interface Bug {
  id: string;
  titulo: string;
  descricao: string;
  severidade: "baixa" | "media" | "alta" | "critica";
  status: "aberto" | "em_andamento" | "resolvido" | "fechado";
  causaRaiz?: string;
  acaoCorretiva?: string;
  projeto_id: string;
  versao?: string;
  metadados?: Record<string, any>;
}

export interface ExecucaoDeTeste {
  id?: string;
  caso_id: string;
  suite_id: string;
  arquivado?: boolean;
  status: "passou" | "falhou" | "bloqueado";
  observacao?: string;
  versao?: string;
  ambiente?: string;
  metadados?: Record<string, any>;
}
