import { createContext, useState } from "react";
import type { SuiteDeTeste } from "../types";
import { suitesDeTesteApi } from "../services/api";

interface SuiteContextData {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  version: string;
  setVersion: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  suitList: SuiteDeTeste[] | undefined;
  setSuitList: React.Dispatch<React.SetStateAction<SuiteDeTeste[] | undefined>>;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  editSuite: boolean;
  setEditSuite: React.Dispatch<React.SetStateAction<boolean>>;
  suiteId: string;
  setSuiteId: React.Dispatch<React.SetStateAction<string>>;

  handleOpenModal: (called: boolean, suitId?: string) => void;
  handleClosedModal: () => void;
  handleCreateSuite: (id: string | undefined) => void;
  loadDataSuite: (id: string | undefined) => void;
  handleDeleteSuite: (id: string) => void;
  handleUpdateSuite: () => void;
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

  const handleOpenModal = (called: boolean, suitId?: string) => {
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
      const response = await suitesDeTesteApi.listar();
      const filteredSuites = response.data.filter(
        (suite: SuiteDeTeste) => suite.projeto_id === id
      );
      setSuitList(filteredSuites);
    } catch (err) {
      console.error("Erro ao listar suites", err);
    }
  };

  const handleCreateSuite = async (id: string | undefined) => {
    const payload: any = {
      nome: name.trim(),
      versao: version.trim(),
      descricao: description.trim(),
      tipo: type,
      projeto_id: id,
      ativa: false,
    };
    try {
      const response = await suitesDeTesteApi.criar(payload);
      setSuitList((prevSuitList) => [...(prevSuitList || []), response.data]);
      handleClosedModal();
      setName("");
      setVersion("");
      setDescription("");
      setType("");
    } catch (err) {
      console.error("Erro ao listar suites", err);
    }
  };

  const handleDeleteSuite = async (id: string) => {
    try {
      await suitesDeTesteApi.excluir(id);
      setSuitList((prevSuitList) =>
        prevSuitList?.filter((suite) => suite.id !== id)
      );
    } catch (error) {
      console.error("Erro ao excluir suite");
    }
  };

  const handleUpdateSuite = async () => {
    const payload: any = {
      nome: name.trim(),
      versao: version.trim(),
      descricao: description.trim(),
      tipo: type,
    };
    try {
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
    }
  };
  return (
    <SuiteContext.Provider
      value={{
        name,
        version,
        description,
        type,
        suitList,
        openModal,
        editSuite,
        suiteId,
        setSuiteId,
        setEditSuite,
        setName,
        setVersion,
        setDescription,
        setType,
        setSuitList,
        setOpenModal,
        handleOpenModal,
        handleClosedModal,
        handleCreateSuite,
        loadDataSuite,
        handleDeleteSuite,
        handleUpdateSuite,
      }}
    >
      {children}
    </SuiteContext.Provider>
  );
}
