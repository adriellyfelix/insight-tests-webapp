import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Container,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { api } from "../services/api";
import type { Projeto } from "../types";
import ProjectForm from "../components/forms/ProjectForm";
import ReportGenerator from "../components/ReportGenerator";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProjectDetails = () => {
  const { projetoId } = useParams<{ projetoId: string }>();
  const navigate = useNavigate();
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [loading, setLoading] = useState(true);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openReportGenerator, setOpenReportGenerator] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchProjeto = async () => {
      if (!projetoId) return;

      try {
        const response = await api.get(`/projetos/${projetoId}`);
        setProjeto(response.data);
      } catch (error) {
        console.error("Erro ao carregar projeto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjeto();
  }, [projetoId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = (projetoEditado: Omit<Projeto, "id">) => {
    // Implementar edição do projeto
    console.log("Editar projeto:", projetoEditado);
    setOpenEditForm(false);
  };

  const handleDelete = async () => {
    if (!projetoId) return;

    if (window.confirm("Tem certeza que deseja excluir este projeto?")) {
      try {
        await api.delete(`/projetos/${projetoId}`);
        navigate("/");
      } catch (error) {
        console.error("Erro ao excluir projeto:", error);
      }
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!projeto) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          Projeto não encontrado
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">{projeto.nome}</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AssessmentIcon />}
            onClick={() => navigate(`/projetos/${projetoId}/dashboard`)}
          >
            Dashboard
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AssessmentIcon />}
            onClick={() => setOpenReportGenerator(true)}
          >
            Relatórios
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => setOpenEditForm(true)}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Excluir
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Descrição
        </Typography>
        <Typography paragraph>{projeto.descricao}</Typography>

        <Typography variant="h6" gutterBottom>
          Status
        </Typography>
        <Typography paragraph>{projeto.status}</Typography>

        <Typography variant="h6" gutterBottom>
          Versão
        </Typography>
        <Typography paragraph>{projeto.versao}</Typography>
      </Paper>

      <ProjectForm
        open={openEditForm}
        onClose={() => setOpenEditForm(false)}
        onSubmit={handleEdit}
        projeto={projeto}
      />

      <ReportGenerator
        open={openReportGenerator}
        onClose={() => setOpenReportGenerator(false)}
        projetoId={Number(projetoId)}
      />

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Visão Geral" />
          <Tab label="Casos de Teste" />
          <Tab label="Suites de Teste" />
          <Tab label="Bugs" />
          <Tab label="Execuções" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Informações do Projeto
                  </Typography>
                  <Typography>
                    <strong>Descrição:</strong> {projeto.descricao}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong> {projeto.status}
                  </Typography>
                  <Typography>
                    <strong>Versão:</strong> {projeto.versao}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Métricas
                  </Typography>
                  {/* TODO: Adicionar métricas do projeto */}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* TODO: Implementar listagem de casos de teste */}
          <Typography>Lista de Casos de Teste</Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* TODO: Implementar listagem de suites de teste */}
          <Typography>Lista de Suites de Teste</Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {/* TODO: Implementar listagem de bugs */}
          <Typography>Lista de Bugs</Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          {/* TODO: Implementar listagem de execuções */}
          <Typography>Lista de Execuções</Typography>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ProjectDetails;
