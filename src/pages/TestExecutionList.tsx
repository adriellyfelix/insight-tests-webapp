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
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { execucoesApi } from "../services/api";
import type { ExecucaoDeTeste } from "../types";

const TestExecutionList: React.FC = () => {
  const [execucoes, setExecucoes] = useState<ExecucaoDeTeste[]>([]);
  const [loading, setLoading] = useState(true);
  const [arquivado, setArquivado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadExecucoes();
  }, []);

  const loadExecucoes = async () => {
    try {
      setLoading(true);
      const response = await execucoesApi.listar();
      setExecucoes(response.data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar execuções de teste");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/execucoes-de-teste/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Tem certeza que deseja excluir esta execução de teste?")
    ) {
      try {
        await execucoesApi.excluir(id);
        setExecucoes(execucoes.filter((execucao) => execucao.id !== id));
      } catch (err) {
        setError("Erro ao excluir execução de teste");
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
    <Box sx={{ minHeight: "100vh", padding: 2 }}>
      <Box sx={{ display: "flex", gap: 10 }}>
        <Typography variant="h4" gutterBottom>
          Execuções de Teste
        </Typography>
        <Box>
          <Typography variant="h6" gutterBottom>
            Resultados antigos
          </Typography>
          <Button
            onClick={() => setArquivado(!arquivado)}
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
          >
            {arquivado ? "Ocultar" : "Exibir"}
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID do Caso</TableCell>
              <TableCell>ID da Suite</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Versão</TableCell>
              <TableCell>Ambiente</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {execucoes
              .filter((execucao) =>
                arquivado ? execucao.arquivado : !execucao.arquivado
              )
              .map((execucao) => (
                <TableRow key={execucao.id}>
                  <TableCell>{execucao.caso_id}</TableCell>
                  <TableCell>{execucao.suite_id}</TableCell>
                  <TableCell>
                    <Chip
                      label={execucao.status}
                      color={
                        execucao.status === "passou"
                          ? "success"
                          : execucao.status === "falhou"
                          ? "error"
                          : "warning"
                      }
                    />
                  </TableCell>
                  <TableCell>{execucao.versao || "-"}</TableCell>
                  <TableCell>{execucao.ambiente || "-"}</TableCell>
                  <TableCell>
                    {/* <IconButton
                      onClick={() => handleEdit(execucao.id!)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton> */}
                    <IconButton
                      onClick={() => handleDelete(execucao.id!)}
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
  );
};

export default TestExecutionList;
