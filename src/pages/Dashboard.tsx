import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Paper,
  InputBase,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Button,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  BugReport as BugReportIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  BarChart as BarChartIcon,
  Folder as FolderIcon,
  Group as GroupIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Sidebar from "../components/Sidebar";
import { storage } from "../storage";
import { dashboard } from "../services/api";
import type { Resumo } from "../types";
const lineData = [
  { name: "JAN", value: 35 },
  { name: "FEV", value: 55 },
  { name: "MAR", value: 75 },
  { name: "ABR", value: 95 },
  { name: "MAI", value: 115 },
  { name: "JUN", value: 135 },
  { name: "JUL", value: 145 },
  { name: "AGO", value: 155 },
  { name: "SET", value: 200 },
  { name: "OUT", value: 225 },
  { name: "NOV", value: 240 },
  { name: "DEZ", value: 250 },
];

const pieData = [
  { name: "Crítico", value: 120, color: "#FF4D4F" },
  { name: "Alto", value: 250, color: "#4096FF" },
  { name: "Baixo", value: 220, color: "#52C41A" },
  { name: "Médio", value: 330, color: "#FAAD14" },
];

const sidebarItems = [
  { label: "Dashboard", icon: <DashboardIcon />, selected: true },
  {
    label: "Projetos",
    icon: <FolderIcon />,
    children: [
      { label: "Suites de Teste", icon: <AssignmentIcon /> },
      { label: "Casos de Teste", icon: <BarChartIcon /> },
    ],
  },
  { label: "Relatorios", icon: <BarChartIcon /> },
  { label: "Dashboard", icon: <DashboardIcon /> },
  { label: "Permissões", icon: <GroupIcon /> },
  { label: "Configurações", icon: <SettingsIcon /> },
  { label: "Sair", icon: <LogoutIcon /> },
];

const Dashboard: React.FC = () => {
  const user = storage.parse("@Insights:user");
  const [resumo, setResumo] = useState<Resumo | null>(null);
  console.log(resumo);
  const metricCards = [
    {
      label: "Total de testes",
      value: resumo?.totalCasos,
      diff: -112,
      percent: 18,
      color: "#E9FFF2",
      textColor: "#1A7F37",
      subColor: "#1A7F37",
    },
    {
      label: "Passou",
      value: resumo?.execucoesPassou,
      diff: -20,
      percent: 18,
      color: "#FFFFE9",
      textColor: "#7F6F1A",
      subColor: "#7F6F1A",
    },
    {
      label: "Bloqueados",
      value: resumo?.execucoesBloqueado,
      diff: -12,
      percent: 18,
      color: "#E9F3FF",
      textColor: "#1A4A7F",
      subColor: "#1A4A7F",
    },
    {
      label: "Falhou",
      value: resumo?.execucoesFalhou,
      diff: 33,
      percent: 18,
      color: "#FFE9E9",
      textColor: "#7F1A1A",
      subColor: "#7F1A1A",
    },
  ];
  useEffect(() => {
    loadResumo();
  }, []);

  const loadResumo = async () => {
    try {
      const response = await dashboard.resumo();
      setResumo(response.data);
    } catch (error) {
      console.error("Erro ao obter resumo", error);
    }
  };
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFB" }}>
      <Sidebar selected="dashboard" />
      <Box sx={{ flex: 1, p: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Bem vindo ao Dashboard do seu projeto
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Aqui você encontrará um painel dinâmico com informações úteis
              acerca dos seus testes.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton>
              <SearchIcon />
            </IconButton>
            <Avatar
              alt={user.nome}
              src="https://randomuser.me/api/portraits/men/32.jpg"
            />
            <Typography fontWeight={500}>{user.nome}</Typography>
            <ExpandMoreIcon />
          </Box>
        </Box>
        {/* Cards de Métricas */}
        <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
          {metricCards.map((card) => (
            <Paper
              key={card.label}
              sx={{
                flex: 1,
                p: 3,
                bgcolor: card.color,
                borderRadius: 3,
                boxShadow: "none",
                minWidth: 180,
              }}
            >
              <Typography fontWeight={600} color={card.textColor} mb={1}>
                {card.label}
              </Typography>
              <Typography variant="h3" fontWeight={700} color={card.textColor}>
                {card.value?.toLocaleString("pt-BR")}
              </Typography>
              <Typography
                fontSize={14}
                color={card.diff < 0 ? "error.main" : "success.main"}
                fontWeight={600}
              >
                {card.diff < 0 ? "-" : "+"}
                {Math.abs(card.diff)} essa semana
              </Typography>
              <Typography fontSize={14} color={card.subColor}>
                +{card.percent}%
              </Typography>
            </Paper>
          ))}
        </Box>
        {/* Gráficos */}
        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <Paper
            sx={{
              flex: 2,
              p: 3,
              borderRadius: 3,
              minWidth: 350,
              bgcolor: "#FFF6F6",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight={700}>
                Saúde do Projeto
              </Typography>
              <Button
                variant="text"
                size="small"
                sx={{ color: "#888" }}
                endIcon={<ExpandMoreIcon />}
              >
                por período
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#1890FF"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
          <Paper sx={{ flex: 1, p: 3, borderRadius: 3, minWidth: 300 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight={700}>
                Bugs por categoria
              </Typography>
              <Button
                variant="text"
                size="small"
                sx={{ color: "#888" }}
                endIcon={<ExpandMoreIcon />}
              >
                por período
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}
            >
              {pieData.map((entry) => (
                <Box
                  key={entry.name}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      bgcolor: entry.color,
                      borderRadius: "50%",
                    }}
                  />
                  <Typography fontSize={14}>{entry.name}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
