import { createContext, useState } from "react";
import type { Projeto } from "../types";
import { projetosApi, suitesDeTesteApi } from "../services/api";

interface ProjectContextData {
  projetos: Projeto[];
  setProjetos: React.Dispatch<React.SetStateAction<Projeto[]>>;

  novoProjeto: any;
  setNovoProjeto: React.Dispatch<React.SetStateAction<any>>;

  projectId: string | undefined;
  setProjectId: React.Dispatch<React.SetStateAction<string | undefined>>;

  editingProjectId: string | null;
  setEditingProjectId: React.Dispatch<React.SetStateAction<string | null>>;

  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;

  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;

  creating: boolean;
  setCreating: React.Dispatch<React.SetStateAction<boolean>>;

  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;

  loadProjetos: () => void;
  handleCreateProject: () => void;
  handleUpdateProject: () => void;
  handleDeleteProject: (id: string) => void;
  handleOpenModal: (project?: Projeto) => void;
  handleCloseModal: () => void;
}

interface ProjectProviderProps {
  children: React.ReactNode;
}

export const ProjectContext = createContext<ProjectContextData>(
  {} as ProjectContextData
);

export default function ProjectProvider({ children }: ProjectProviderProps) {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [projectId, setProjectId] = useState<string | undefined>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [novoProjeto, setNovoProjeto] = useState({
    nome: "",
    descricao: "",
    status: "ATIVO",
    versao: "1.0.0",
  });

  const loadProjetos = async () => {
    try {
      setLoading(true);
      const response = await projetosApi.listar();
      // Ordena os projetos por nome
      const projetosOrdenados = response.data.sort((a, b) =>
        a.nome.localeCompare(b.nome)
      );
      setProjetos(projetosOrdenados);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar projetos");
      console.error("Erro ao carregar projetos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project?: Projeto) => {
    if (project) {
      setEditingProjectId(project.id);
      setNovoProjeto({
        nome: project.nome,
        descricao: project.descricao,
        status: project.status,
        versao: project.versao,
      });
    } else {
      setEditingProjectId(null);
      setNovoProjeto({
        nome: "",
        descricao: "",
        status: "ATIVO",
        versao: "1.0.0",
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNovoProjeto({
      nome: "",
      descricao: "",
      status: "ATIVO",
      versao: "1.0.0",
    });
    setError(null);
  };

  const handleCreateProject = async () => {
    try {
      if (!novoProjeto.nome.trim()) {
        setError("O nome do projeto é obrigatório");
        return;
      }

      setCreating(true);
      const response = await projetosApi.criar({
        nome: novoProjeto.nome.trim().toLocaleLowerCase(),
        descricao: novoProjeto.descricao.trim(),
        status: novoProjeto.status,
        versao: novoProjeto.versao.trim(),
      });
      if (response.data) {
        // Adiciona o novo projeto à lista e ordena
        const novosProjetos = [...projetos, response.data].sort((a, b) =>
          a.nome.localeCompare(b.nome)
        );
        setProjetos(novosProjetos);
        handleCloseModal();
        setError(null);
      }
    } catch (error: any) {
      if (error.response.status === 403) {
        setError("Você não tem permissão para criar um projeto.");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateProject = async () => {
    try {
      if (!novoProjeto.nome.trim()) {
        setError("O nome do projeto é obrigatório");
        return;
      }
      const response = await projetosApi.atualizar(editingProjectId!, {
        nome: novoProjeto.nome.trim(),
        descricao: novoProjeto.descricao.trim(),
        status: novoProjeto.status,
        versao: novoProjeto.versao.trim(),
      });

      if (response.data) {
        setProjetos((prev) =>
          prev.map((project) =>
            project.id === editingProjectId ? response.data : project
          )
        );
        handleCloseModal();
        setError(null);
      }
    } catch (error) {
      setError("Erro ao editar projeto.");
    }
  };

  const handleDeleteProject = async (id: string) => {
    const response = await suitesDeTesteApi.listar();
    const suiteExists = response.data.some((suite) => suite.projeto_id === id);

    if (suiteExists) {
      setError("Exclua suas suítes de teste antes de excluir seu projeto.");
      return;
    }

    try {
      await projetosApi.excluir(id);
      localStorage.removeItem("projectId");
      setProjetos((prev) => prev.filter((project) => project.id !== id));
    } catch (error: any) {
      if (error.response.status === 403) {
        setError("Você não tem permissão para excluir este projeto");
      } else {
        setError("Erro ao excluir projeto");
      }
    }
  };
  return (
    <ProjectContext.Provider
      value={{
        projetos,
        novoProjeto,
        editingProjectId,
        projectId,
        loading,
        creating,
        error,
        openModal,
        setProjectId,
        setEditingProjectId,
        setProjetos,
        setNovoProjeto,
        setLoading,
        setCreating,
        setError,
        setOpenModal,
        loadProjetos,
        handleCreateProject,
        handleUpdateProject,
        handleDeleteProject,
        handleOpenModal,
        handleCloseModal,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
