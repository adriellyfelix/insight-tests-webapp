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

  handleOpenModal: () => void;
  handleClosedModal: () => void;
  handleCreateSuite: (id: string | undefined) => void;
  loadDataSuite: (id: string | undefined) => void;
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

  const handleOpenModal = () => {
    setOpenModal(true);
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
      nome: name.trim().toLowerCase(),
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
      console.log("Suite criada", response.data);
    } catch (err) {
      console.error("Erro ao listar suites", err);
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
      }}
    >
      {children}
    </SuiteContext.Provider>
  );
}
