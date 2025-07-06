import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import Sidebar from "../components/Sidebar";
import { reports } from "../services/api";
import useProject from "../hooks/useProject";
import type { Report, ReportEdit } from "../types";

const Reports: React.FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [reportList, setReportList] = useState<Report[]>([]);
  const [edition, setEdition] = useState<ReportEdit>({ type: "Criar" });
  const [projectId, setProjectId] = useState<string>("");
  const [reportId, setReportId] = useState<string>("");
  const { projetos, loadProjetos } = useProject();

  useEffect(() => {
    loadData();
    loadProjetos();
  }, []);
  const loadData = async () => {
    try {
      const response = await reports.listar();
      setReportList(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateReport = async () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !type.trim() ||
      !content.trim() ||
      !projectId.trim()
    ) {
      setError("Preencha os campos obrigatórios!");
      return;
    }
    try {
      const payload = {
        titulo: title.trim(),
        descricao: description.trim(),
        tipo: type.trim(),
        projeto_id: projectId.trim(),
        dados: content.trim(),
      };
      await reports.create(payload);
      setTitle("");
      setDescription("");
      setContent("");
      setType("");
      setProjectId("");
      loadData();
      setOpenModal(false);
    } catch (error) {
      console.error("Erro ao criar relatório. Erro:", error);
    }
  };

  const handleEdit = async (id: string) => {
    const payload = {
      titulo: title.trim(),
      descricao: description.trim(),
      tipo: type.trim(),
      projeto_id: projectId.trim(),
      dados: content.trim(),
    };
    try {
      await reports.update(id, payload);
      loadData();
      setTitle("");
      setDescription("");
      setContent("");
      setType("");
      setProjectId("");
      setOpenModal(false);
      setEdition({ type: "Criar" });
    } catch (error) {
      console.error("Erro ao editar relatório");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await reports.delete(id);
      loadData();
    } catch (error) {
      console.error("Erro ao excluir relatório:", error);
    }
  };

  const handleModalEdit = (id: string) => {
    const selected = reportList?.find((report) => report.id === id);
    if (selected) {
      setTitle(selected.titulo);
      setDescription(selected.descricao);
      setContent(selected.dados);
      setType(selected.tipo);
      setProjectId(selected.projeto_id);
    }
    setOpenModal(true);
    setOpenModal(true);
    setReportId(id);
    setEdition({ type: "Editar" });
  };

  const handleClosedModal = () => {
    setEdition({ type: "Criar" });
    setTitle("");
    setDescription("");
    setContent("");
    setType("");
    setProjectId("");
    setOpenModal(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFB" }}>
      <Sidebar selected="relatorios" />
      <Box
        sx={{
          flex: 1,
          p: 4,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "transparent",
            boxShadow: "none",
            p: 6,
            width: "100%",
            maxWidth: 420,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" fontWeight={700} color="#3B5CB8" mb={1}>
            Relatórios
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenModal(true)}
          >
            Adicionar relatório
          </Button>
        </Paper>
        <Box>
          {reportList.map((item, id) => (
            <List
              key={id}
              sx={{ backgroundColor: "#FFFF", marginBottom: "30px" }}
            >
              <ListItem sx={{ gap: "8px" }}>
                <Typography fontWeight={700} color="#3B5CB8">
                  Título:
                </Typography>
                <Typography>{item.titulo}</Typography>
              </ListItem>
              <ListItem sx={{ gap: "8px" }}>
                <Typography fontWeight={700} color="#3B5CB8">
                  Descrição:
                </Typography>
                <Typography>{item.descricao}</Typography>
              </ListItem>
              <ListItem sx={{ gap: "8px" }}>
                <Typography fontWeight={700} color="#3B5CB8">
                  Tipo:
                </Typography>
                <Typography>{item.tipo}</Typography>
              </ListItem>
              <ListItem sx={{ gap: "8px" }}>
                <Typography fontWeight={700} color="#3B5CB8">
                  Dados:
                </Typography>
                <Typography>{item.dados}</Typography>
              </ListItem>
              <ListItem sx={{ gap: "8px" }}>
                <Typography fontWeight={700} color="#3B5CB8">
                  Id do projeto:
                </Typography>
                <Typography>{item.projeto_id}</Typography>
              </ListItem>
              <ListItem sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton
                  sx={{
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                  onClick={() => handleDelete(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  sx={{
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                  onClick={() => handleModalEdit(item.id)}
                >
                  <EditIcon />
                </IconButton>
              </ListItem>
            </List>
          ))}
        </Box>
      </Box>
      <Dialog open={openModal} maxWidth="sm" fullWidth>
        <DialogTitle>Relatório</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              name="titulo"
              label="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              error={!!error && !title.trim()}
              helperText={
                error && !title.trim() ? "Este campo não pode estar vazio." : ""
              }
            />
            <TextField
              name="descricao"
              label="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              required
              error={!!error && !description.trim()}
              helperText={
                error && !description.trim()
                  ? "Este campo não pode estar vazio."
                  : ""
              }
            />
            <TextField
              name="projeto_id"
              label="Escolha o projeto"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              fullWidth
              required
              select
              error={!!error && !projectId.trim()}
              helperText={
                error && !projectId.trim()
                  ? "Este campo não pode estar vazio."
                  : ""
              }
            >
              {projetos.map((proj) => (
                <MenuItem key={proj?.id} value={proj?.id}>
                  {proj?.nome}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="tipo"
              label="Tipo"
              value={type}
              onChange={(e) => setType(e.target.value)}
              select
              fullWidth
              required
              error={!!error && !type.trim()}
              helperText={
                error && !type.trim() ? "Este campo não pode estar vazio." : ""
              }
            >
              <MenuItem value="bugs">Bugs</MenuItem>
              <MenuItem value="testes">Testes</MenuItem>
              <MenuItem value="cobertura">Cobertura</MenuItem>
              <MenuItem value="performance">Performance</MenuItem>
              <MenuItem value="customizado">Customizado</MenuItem>
            </TextField>
            <TextField
              name="dados"
              label="Conteúdo"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              minRows={4}
              fullWidth
              required
              error={!!error && !content.trim()}
              helperText={
                error && !content.trim()
                  ? "Este campo não pode estar vazio."
                  : ""
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosedModal}>Cancelar</Button>
          <Button
            onClick={
              edition.type === "Criar"
                ? () => handleCreateReport()
                : () => handleEdit(reportId)
            }
          >
            {edition.type === "Criar" ? "Criar" : "Editar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reports;
