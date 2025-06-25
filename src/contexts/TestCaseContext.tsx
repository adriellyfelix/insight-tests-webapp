import { createContext, useState } from "react";
import type { CasoDeTeste } from "../types";
import { casosDeTesteApi } from "../services/api";

interface TestCaseContextData {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;

  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;

  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;

  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;

  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;

  steps: string[];
  setSteps: React.Dispatch<React.SetStateAction<string[]>>;

  expectedResult: string;
  setExpectedResult: React.Dispatch<React.SetStateAction<string>>;

  selectedTestCase: string | undefined;
  setSelectedTestCase: React.Dispatch<React.SetStateAction<string | undefined>>;

  editTest: boolean;
  setEditTest: React.Dispatch<React.SetStateAction<boolean>>;

  casosDeTeste: CasoDeTeste[];
  setCasosDeTeste: React.Dispatch<React.SetStateAction<CasoDeTeste[]>>;

  handleOpenModalEdit: (idCasoDeTeste?: string) => void;
  handleOpenModalCreate: () => void;
  handleClosedModal: () => void;
  loadCasosDeTeste: (suiteId: string | undefined) => void;
  handleCreate: (projectId: string, suiteId: string) => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
}

interface TestCaseContextProps {
  children: React.ReactNode;
}

export const TestCaseContext = createContext<TestCaseContextData>(
  {} as TestCaseContextData
);

export default function TestCaseProvider({ children }: TestCaseContextProps) {
  const [casosDeTeste, setCasosDeTeste] = useState<CasoDeTeste[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [steps, setSteps] = useState<string[]>([]);
  const [expectedResult, setExpectedResult] = useState<string>("");
  const [editTest, setEditTest] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<string | undefined>(
    ""
  );
  const handleOpenModalEdit = (idCasoDeTeste?: string) => {
    setEditTest(false);
    setOpenModal(true);
    setSelectedTestCase(idCasoDeTeste);
  };
  const handleOpenModalCreate = () => {
    setEditTest(true);
    setOpenModal(true);
  };
  const handleClosedModal = () => {
    setOpenModal(false);
  };

  const loadCasosDeTeste = async (suiteId: string | undefined) => {
    try {
      setLoading(true);
      const response = await casosDeTesteApi.listar();
      const filteredCasosDeTeste = response.data.filter(
        (teste: any) => teste.suite_id === suiteId
      );
      setCasosDeTeste(filteredCasosDeTeste);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar casos de teste");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleCreate = async (projectId: string, suiteId: string) => {
    try {
      const payload: any = {
        titulo: name.trim(),
        descricao: description.trim(),
        passos: steps,
        resultadoEsperado: expectedResult.trim(),
        projeto_id: projectId,
        suite_id: suiteId,
      };
      const response = await casosDeTesteApi.criar(payload);
      setCasosDeTeste((prevCasos) => [...prevCasos, response.data]);
      console.log("Caso de teste criado");
      setOpenModal(false);
    } catch (error) {
      console.log("Erro ao criar caso de teste", error);
    }
  };
  const handleEdit = async (id: string) => {
    setOpenModal(true);
    try {
      const payload: Partial<CasoDeTeste> = {
        titulo: name.trim(),
        descricao: description.trim(),
        passos: steps,
        resultadoEsperado: expectedResult.trim(),
      };
      const response = await casosDeTesteApi.atualizar(id, payload);
      setCasosDeTeste((prevCasos) =>
        prevCasos.map((caso) =>
          caso.id === id ? { ...caso, ...response.data } : caso
        )
      );
      console.log("dados atualizados");
    } catch (error) {
      console.error("erro ao atualizar caso de teste", error);
    }
    setOpenModal(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este caso de teste?")) {
      try {
        await casosDeTesteApi.excluir(id);
        setCasosDeTeste(casosDeTeste.filter((caso) => caso.id !== id));
      } catch (err) {
        setError("Erro ao excluir caso de teste");
        console.error(err);
      }
    }
  };
  return (
    <TestCaseContext.Provider
      value={{
        name,
        description,
        loading,
        error,
        openModal,
        steps,
        expectedResult,
        selectedTestCase,
        editTest,
        casosDeTeste,
        setCasosDeTeste,
        setName,
        setDescription,
        setLoading,
        setError,
        setOpenModal,
        setSteps,
        setExpectedResult,
        setSelectedTestCase,
        setEditTest,
        loadCasosDeTeste,
        handleClosedModal,
        handleCreate,
        handleDelete,
        handleEdit,
        handleOpenModalCreate,
        handleOpenModalEdit,
      }}
    >
      {children};
    </TestCaseContext.Provider>
  );
}
