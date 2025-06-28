import { createContext, useState } from "react";
import type { CasoDeTeste } from "../types";
import { casosDeTesteApi, execucoesApi } from "../services/api";
import type { ExecucaoDeTeste } from "../types";

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

  idCasoDeTeste: string;
  setIdCasoDeTeste: React.Dispatch<React.SetStateAction<string>>;

  testStarted: any;
  setTestStarted: React.Dispatch<React.SetStateAction<any>>;

  testStatus: any;
  setTestStatus: React.Dispatch<React.SetStateAction<any>>;

  statusExecucao: string;
  setStatusExecucao: React.Dispatch<
    React.SetStateAction<"passou" | "falhou" | "bloqueado">
  >;

  handleOpenModalEdit: (idCasoDeTeste?: string) => void;
  handleOpenModalCreate: () => void;
  handleClosedModal: () => void;
  loadCasosDeTeste: (suiteId: string | undefined) => void;
  handleCreate: (projectId: string, suiteId: string) => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  runTestCase: (caso_id: string, suite_id: string) => void;
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
  const [idCasoDeTeste, setIdCasoDeTeste] = useState("");
  const [testStarted, setTestStarted] = useState<Map<string, boolean>>(
    new Map()
  );
  const [testStatus, setTestStatus] = useState<Map<string, string>>(new Map());
  const [statusExecucao, setStatusExecucao] = useState<
    "passou" | "falhou" | "bloqueado"
  >("passou");

  const handleOpenModalEdit = (idCasoDeTesteEdit?: string) => {
    setEditTest(false);
    setOpenModal(true);
    setSelectedTestCase(idCasoDeTesteEdit);
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
    const cleanedSteps = steps
      .map((step) => step.trim())
      .filter((step) => step);
    if (
      !name.trim() ||
      !description.trim() ||
      !expectedResult.trim() ||
      !cleanedSteps.length
    ) {
      setError("Preencha os campos obrigatórios!");
      return;
    }
    try {
      setLoading(true);
      const payload: any = {
        titulo: name.trim(),
        descricao: description.trim(),
        passos: cleanedSteps,
        resultadoEsperado: expectedResult.trim(),
        projeto_id: projectId,
        suite_id: suiteId,
      };
      const response = await casosDeTesteApi.criar(payload);
      setCasosDeTeste((prevCasos) => [...prevCasos, response.data]);
      localStorage.setItem("casoDeTesteId", response.data.id);
      setOpenModal(false);
      setName("");
      setDescription("");
      setExpectedResult("");
      setSteps([]);
    } catch (error) {
      console.log("Erro ao criar caso de teste", error);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = async (id: string) => {
    const cleanedSteps = steps
      .map((step) => step.trim())
      .filter((step) => step);
    if (
      !name.trim() ||
      !description.trim() ||
      !expectedResult.trim() ||
      !cleanedSteps.length
    ) {
      setError("Preencha os campos obrigatórios!");
      return;
    }
    setOpenModal(true);
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este caso de teste?")) {
      try {
        setLoading(true);
        await casosDeTesteApi.excluir(id);
        setCasosDeTeste(casosDeTeste.filter((caso) => caso.id !== id));
      } catch (err) {
        setError("Erro ao excluir caso de teste");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const runTestCase = async (caso_id: string, suite_id: string) => {
    try {
      setLoading(true);
      console.log(statusExecucao);
      const payload: ExecucaoDeTeste = {
        status: statusExecucao,
        caso_id,
        suite_id,
      };
      const response = await execucoesApi.criar(payload);
      setTestStarted((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(caso_id, true);
        return newMap;
      });

      setTestStatus((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(caso_id, response.data.status);
        return newMap;
      });

      console.log("Execução de teste criada.");
    } catch (error) {
      console.error("Erro ao executar caso de teste");
    } finally {
      setLoading(false);
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
        idCasoDeTeste,
        testStarted,
        testStatus,
        statusExecucao,
        setTestStarted,
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
        setIdCasoDeTeste,
        loadCasosDeTeste,
        handleClosedModal,
        handleCreate,
        handleDelete,
        handleEdit,
        handleOpenModalCreate,
        handleOpenModalEdit,
        runTestCase,
        setTestStatus,
        setStatusExecucao,
      }}
    >
      {children};
    </TestCaseContext.Provider>
  );
}
