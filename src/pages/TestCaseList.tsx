import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

import { casosDeTesteApi } from "../services/api";
import type { CasoDeTeste } from "../types";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const TestCaseList: React.FC = () => {
  const [casosDeTeste, setCasosDeTeste] = useState<CasoDeTeste[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [steps, setSteps] = useState<string[]>([]);
  const [expectedResult, setExpectedResult] = useState<string>("");
  const [selectedTestCase, setSelectedTestCase] = useState<string | undefined>(
    ""
  );
  const [editTest, setEditTest] = useState(false);
  const { suiteId } = useParams();

  const projectId = localStorage.getItem("projectId");

  useEffect(() => {
    loadCasosDeTeste();
  }, []);

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

  const loadCasosDeTeste = async () => {
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

  const handleCreate = async () => {
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

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFB" }}>
      <Sidebar selected="caso-de-teste" />
      <Box sx={{ flex: 1, p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Casos de Teste
        </Typography>
        <Button
          onClick={handleOpenModalCreate}
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
        >
          Novo caso de teste
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Passos</TableCell>
                <TableCell>Resultado esperado</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {casosDeTeste.map((caso) => (
                <TableRow key={caso.id}>
                  <TableCell>{caso.titulo}</TableCell>
                  <TableCell>{caso.descricao}</TableCell>
                  {/* <TableCell>{caso.passos}</TableCell> */}
                  <TableCell>
                    <ul
                      style={{ margin: 0, padding: 0, listStyleType: "none" }}
                    >
                      {caso.passos.map((passo, index) => (
                        <li key={index}>{passo}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>{caso.resultadoEsperado}</TableCell>
                  {/* <TableCell>
                    <Chip
                      label={caso.prioridade}
                      color={
                        caso.prioridade === "critica"
                          ? "error"
                          : caso.prioridade === "alta"
                          ? "warning"
                          : caso.prioridade === "media"
                          ? "info"
                          : "success"
                      }
                    />
                  </TableCell> */}
                  {/* <TableCell>{caso.tipo}</TableCell> */}
                  {/* <TableCell>
                    <Chip
                      label={caso.ativo ? "Ativo" : "Inativo"}
                      color={caso.ativo ? "success" : "default"}
                    />
                  </TableCell> */}
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpenModalEdit(caso.id)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(caso.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={openModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editTest ? "Criar caso de teste" : "Editar caso de teste"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              name="nome"
              label="Caso de teste"
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              name="descricao"
              label="Descrição"
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              name="passos"
              label="Passos"
              onChange={(e) => setSteps(e.target.value.split("\n"))}
              multiline
              rows={3}
              fullWidth
            ></TextField>

            <TextField
              name="resultadoEsperado"
              label="Resultado esperado"
              fullWidth
              onChange={(e) => setExpectedResult(e.target.value)}
            ></TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosedModal}>Cancelar</Button>

          <Button
            onClick={
              editTest
                ? () => handleCreate()
                : // @ts-ignore
                  () => handleEdit(selectedTestCase)
            }
            variant="contained"
            color="primary"
          >
            {editTest ? "Criar" : "Editar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestCaseList;
