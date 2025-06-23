import React, { useEffect, useState } from "react";
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

import { suitesDeTesteApi } from "../services/api";
import type { SuiteDeTeste } from "../types";
import { useParams } from "react-router-dom";

const TestSuiteList: React.FC = () => {
  useEffect(() => {
    loadDataSuite();
  }, []);
  const { id } = useParams();

  const [name, setName] = useState<string>("");
  const [version, setVersion] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<string>("");

  //Carregar dados do bakcend.
  const [suitList, setSuitList] = useState<SuiteDeTeste[]>();

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleClosedModal = () => {
    setOpenModal(false);
  };

  const loadDataSuite = async () => {
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

  const handleCreateSuite = async () => {
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
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFB" }}>
      <Sidebar selected="suites" />
      <Box sx={{ flex: 1, p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Suites de Teste
        </Typography>
        <Button
          onClick={handleOpenModal}
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
                suitList?.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.nome}</TableCell>
                    <TableCell>{project.descricao}</TableCell>
                    <TableCell>{project.versao}</TableCell>
                    <TableCell align="right">
                      <Button size="small" color="primary" sx={{ mr: 1 }}>
                        Editar
                      </Button>
                      <Button size="small" color="error">
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
              //error={!!error && !novoProjeto.nome.trim()}
              // helperText={
              //   error && !novoProjeto.nome.trim()
              //     ? "O nome do projeto é obrigatório"
              //     : ""
              // }
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
            onClick={handleCreateSuite}
            variant="contained"
            color="primary"
          >
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestSuiteList;
