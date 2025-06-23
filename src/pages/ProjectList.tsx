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
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import useProject from "../hooks/useProject";

const ProjectList: React.FC = () => {
  const {
    handleOpenModal,
    handleCloseModal,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
    loadProjetos,

    setNovoProjeto,

    loading,
    error,
    creating,
    openModal,
    novoProjeto,
    projetos,
    editingProjectId,
  } = useProject();

  useEffect(() => {
    loadProjetos();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNovoProjeto((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ATIVO":
        return "success";
      case "INATIVO":
        return "error";
      case "EM_DESENVOLVIMENTO":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFB" }}>
      <Sidebar selected="projetos" />
      <Box sx={{ flex: 1, p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Projetos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={() => handleOpenModal()}
        >
          Novo Projeto
        </Button>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Versão</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projetos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Nenhum projeto encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  projetos.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>{project.nome}</TableCell>
                      <TableCell>{project.descricao}</TableCell>
                      <TableCell>
                        <Chip
                          label={project.status}
                          color={getStatusColor(project.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{project.versao}</TableCell>
                      <TableCell align="right">
                        <Button
                          onClick={() => handleOpenModal(project)}
                          size="small"
                          color="primary"
                          sx={{ mr: 1 }}
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleDeleteProject(project.id)}
                          size="small"
                          color="error"
                        >
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Criar Novo Projeto</DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <TextField
                name="nome"
                label="Nome do Projeto"
                value={novoProjeto.nome}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!error && !novoProjeto.nome.trim()}
                helperText={
                  error && !novoProjeto.nome.trim()
                    ? "O nome do projeto é obrigatório"
                    : ""
                }
              />
              <TextField
                name="descricao"
                label="Descrição"
                value={novoProjeto.descricao}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                name="status"
                label="Status"
                value={novoProjeto.status}
                onChange={handleInputChange}
                select
                fullWidth
              >
                <MenuItem value="ATIVO">Ativo</MenuItem>
                <MenuItem value="INATIVO">Inativo</MenuItem>
                <MenuItem value="EM_DESENVOLVIMENTO">
                  Em Desenvolvimento
                </MenuItem>
              </TextField>
              <TextField
                name="versao"
                label="Versão"
                value={novoProjeto.versao}
                onChange={handleInputChange}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} disabled={creating}>
              Cancelar
            </Button>
            <Button
              onClick={
                editingProjectId ? handleUpdateProject : handleCreateProject
              }
              variant="contained"
              color="primary"
              disabled={creating}
              startIcon={
                creating ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {editingProjectId ? "Editar" : "Criar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ProjectList;
