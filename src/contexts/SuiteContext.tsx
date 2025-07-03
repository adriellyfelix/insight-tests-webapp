import { createContext, useState } from "react";
import type { SuiteDeTeste } from "../types";
import { casosDeTesteApi, suitesDeTesteApi } from "../services/api";

interface SuiteContextData {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;

  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;

  version: string;
  setVersion: React.Dispatch<React.SetStateAction<string>>;

  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;

  suitList: SuiteDeTeste[] | undefined;
  setSuitList: React.Dispatch<React.SetStateAction<SuiteDeTeste[] | undefined>>;

  editSuite: boolean;
  setEditSuite: React.Dispatch<React.SetStateAction<boolean>>;

  suiteId: string;
  setSuiteId: React.Dispatch<React.SetStateAction<string>>;

  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;

  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;

  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;

  loadDataSuite: (id: string | undefined) => void;
  handleCreateSuite: (id: string | undefined) => void;
  handleUpdateSuite: () => void;
  handleDeleteSuite: (id: string) => void;
  handleOpenModal: (called: boolean, suitId?: string) => void;
  handleClosedModal: () => void;
}

interface SuiteProps {
  children: React.ReactNode;
}

export const SuiteContext = createContext<SuiteContextData>(
  {} as SuiteContextData
);

export default function SuiteProvider({ children }: SuiteProps) {
  const [name, setName] = useState<string>("");
  const [version, setVersion] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [suitList, setSuitList] = useState<SuiteDeTeste[]>();
  const [openModal, setOpenModal] = useState(false);
  const [editSuite, setEditSuite] = useState(false);
  const [suiteId, setSuiteId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const handleOpenModal = (called: boolean, suitId?: string) => {
    const selected = suitList?.find((suite) => suite.id === suitId);
    if (selected) {
      setName(selected.nome);
      setDescription(selected.descricao!);
      setVersion(selected.versao!);
      setType(selected.tipo);
    }
    setOpenModal(true);

    if (called) {
      setEditSuite(true);
    } else {
      setEditSuite(false);
      setSuiteId(suitId!);
    }
  };

  const handleClosedModal = () => {
    setOpenModal(false);
  };

  const loadDataSuite = async (id: string | undefined) => {
    try {
      setLoading(true);
      const response = await suitesDeTesteApi.listar();
      const filteredSuites = response.data.filter(
        (suite: SuiteDeTeste) => suite.projeto_id === id
      );
      setSuitList(filteredSuites);
    } catch (err) {
      console.error("Erro ao listar suites", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuite = async (id: string | undefined) => {
    if (!name.trim() || !type.trim()) {
      setError("Preencha os campos obrigatórios!");
      return;
    }
    try {
      setLoading(true);

      const payload: any = {
        nome: name.trim(),
        versao: version.trim(),
        descricao: description.trim(),
        tipo: type,
        projeto_id: id,
        ativa: false,
      };
      const response = await suitesDeTesteApi.criar(payload);
      setSuitList((prevSuitList) => [...(prevSuitList || []), response.data]);
      handleClosedModal();
      setName("");
      setVersion("");
      setDescription("");
      setType("");
    } catch (err) {
      console.error("Erro ao listar suites", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSuite = async (id: string) => {
    const response = await casosDeTesteApi.listar();
    const testCaseExists = response.data.some(
      (testCase) => testCase.suite_id === id
    );
    if (testCaseExists) {
      setError("Exclua seus casos de teste antes de excluir sua suíte.");
      return;
    }
    try {
      setLoading(true);
      await suitesDeTesteApi.excluir(id);
      setSuitList((prevSuitList) =>
        prevSuitList?.filter((suite) => suite.id !== id)
      );
    } catch (error) {
      console.error("Erro ao excluir suite");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSuite = async () => {
    if (!name.trim() || !type.trim()) {
      setError("Preencha os campos obrigatórios!");
      return;
    }
    try {
      setLoading(true);
      const payload: any = {
        nome: name.trim(),
        versao: version.trim(),
        descricao: description.trim(),
        tipo: type,
      };
      const response = await suitesDeTesteApi.atualizar(suiteId, payload);
      setSuitList((prevSuitList) =>
        prevSuitList?.map((suite) =>
          suite.id === suiteId ? { ...suite, ...response.data } : suite
        )
      );
      handleClosedModal();
      setName("");
      setVersion("");
      setDescription("");
      setType("");
    } catch (error) {
      console.error("Erro ao editar o projeto", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SuiteContext.Provider
      value={{
        name,
        description,
        version,
        type,
        suitList,
        editSuite,
        suiteId,
        openModal,
        error,
        loading,
        setLoading,
        setError,
        setSuiteId,
        setEditSuite,
        setSuitList,
        setName,
        setDescription,
        setVersion,
        setType,
        setOpenModal,
        loadDataSuite,
        handleOpenModal,
        handleClosedModal,
        handleCreateSuite,
        handleUpdateSuite,
        handleDeleteSuite,
      }}
    >
      {children}
    </SuiteContext.Provider>
  );
}
