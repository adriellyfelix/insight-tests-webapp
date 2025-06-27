import React, { useEffect } from "react";
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
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useCaseTest from "../hooks/useCaseTest";
const TestCaseList: React.FC = () => {
  const {
    openModal,
    selectedTestCase,
    loading,
    editTest,
    error,
    casosDeTeste,
    setName,
    setDescription,
    setSteps,
    setExpectedResult,
    loadCasosDeTeste,
    handleOpenModalCreate,
    handleClosedModal,
    handleCreate,
    handleOpenModalEdit,
    handleDelete,
    handleEdit,
    runTestCase,
    setStatusExecucao,
    testStarted,
    testStatus,
  } = useCaseTest();

  const { suiteId } = useParams();

  const projectId = localStorage.getItem("projectId");
  const casoDeTesteId = localStorage.getItem("casoDeTesteId");
  useEffect(() => {
    loadCasosDeTeste(suiteId);
  }, []);

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
                <TableCell>Executar teste</TableCell>
                <TableCell>Visualizar resultado</TableCell>
                <TableCell>Bugs</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {casosDeTeste.map((caso) => (
                <TableRow key={caso.id}>
                  <TableCell>{caso.titulo}</TableCell>
                  <TableCell>{caso.descricao}</TableCell>
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
                  <TableCell>
                    <Button
                      onClick={() => runTestCase(caso.id, suiteId!)}
                      variant="contained"
                      component="label"
                      color="primary"
                    >
                      Executar
                    </Button>
                  </TableCell>
                  <TableCell>
                    {testStarted.get(caso.id) ? (
                      <a href={`/testresult/${casoDeTesteId}/execucoes`}>
                        Visualizar
                      </a>
                    ) : (
                      <span>Resultado ainda não gerado</span>
                    )}
                  </TableCell>
                  {testStatus.get(caso.id) === "falhou" ||
                  testStatus.get(caso.id) === "bloqueado" ? (
                    <TableCell>
                      <Button
                        variant="contained"
                        component="label"
                        color="error"
                      >
                        <input type="file" hidden />
                        Incluir evidência
                      </Button>
                    </TableCell>
                  ) : (
                    <TableCell>Nenhum Bug</TableCell>
                  )}
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
              name="status"
              label="Status"
              select
              fullWidth
              onChange={(e) => setStatusExecucao(e.target.value)}
            >
              <MenuItem value="passou">Passou</MenuItem>
              <MenuItem value="falhou">Falhou</MenuItem>
              <MenuItem value="bloqueado">Bloqueado</MenuItem>
            </TextField>
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
                ? () => handleCreate(projectId!, suiteId!)
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
