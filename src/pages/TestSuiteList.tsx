import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

import Sidebar from "../components/Sidebar";

import useSuite from "../hooks/useSuite";
import { useParams } from "react-router-dom";

const TestSuiteList: React.FC = () => {
  const { id } = useParams();

  localStorage.setItem("projectId", id || "");
  useEffect(() => {
    loadDataSuite(id);
  }, []);

  const {
    loadDataSuite,
    handleOpenModal,
    suitList,
    openModal,
    name,
    setName,
    setType,
    handleClosedModal,
    setVersion,
    setDescription,
    handleCreateSuite,
    handleDeleteSuite,
    handleUpdateSuite,
    editSuite,
    description,
  } = useSuite();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFB" }}>
      <Sidebar selected="suites" />
      <Box sx={{ flex: 1, p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Suites de Teste
        </Typography>
        <Button
          onClick={() => handleOpenModal(true)}
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
        >
          Nova suite
        </Button>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome da suite</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Versão</TableCell>
                <TableCell>Caso de teste</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suitList?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhum suite encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                suitList?.map((suite) => (
                  <TableRow key={suite.id}>
                    <TableCell>{suite.nome}</TableCell>
                    <TableCell>{suite.descricao}</TableCell>
                    <TableCell>{suite.versao}</TableCell>
                    <TableCell>
                      <a href={`/projetos/${suite.id}/casos-de-teste`}>
                        Ir para caso de teste
                      </a>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={() => handleOpenModal(false, suite.id)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteSuite(suite.id)}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>
      <Dialog open={openModal} maxWidth="sm" fullWidth>
        <DialogTitle>Criar Nova Suite</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              name="nome"
              label="Nome da suite"
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              error={name.trim() === ""}
              helperText={
                name.trim() === "" ? "O nome da suite é obrigatório" : ""
              }
            />
            <TextField
              name="descricao"
              label="Descrição"
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              required
              error={description.trim() === ""}
              helperText={
                name.trim() === "" ? "A descrição da suite é obrigatório" : ""
              }
              rows={3}
            />
            <TextField
              name="Versao"
              label="Versão"
              // value={novoProjeto.status}
              onChange={(e) => setVersion(e.target.value)}
              fullWidth
            ></TextField>

            <TextField
              name="tipo"
              label="Tipo"
              select
              fullWidth
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="funcional">Funcional</MenuItem>
              <MenuItem value="regressao">Regressão</MenuItem>
              <MenuItem value="seguranca">Segurança</MenuItem>
              <MenuItem value="usabilidade">Usabilidade</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosedModal}>Cancelar</Button>
          <Button
            onClick={
              editSuite
                ? () => handleCreateSuite(id)
                : () => handleUpdateSuite()
            }
            variant="contained"
            color="primary"
          >
            {editSuite ? "Criar" : "Editar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestSuiteList;
