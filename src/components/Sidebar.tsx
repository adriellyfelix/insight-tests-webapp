import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  Collapse,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  Folder as FolderIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import useProject from "../hooks/useProject";
import { useAuth } from "../contexts/AuthContext";

interface SidebarProps {
  selected?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ selected }) => {
  const { projetos } = useProject();
  const { signOut } = useAuth();
  const [showProjects, setShowProjects] = useState(false);

  const toggleProjects = () => setShowProjects(!showProjects);
  return (
    <Box
      sx={{
        width: 240,
        bgcolor: "#fff",
        borderRight: "1px solid #F0F0F0",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minHeight: "100vh",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/"
              selected={selected === "home"}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: selected === "home" ? "#E6F0FF" : undefined,
              }}
            >
              <ListItemIcon>
                <DashboardIcon
                  sx={{ color: selected === "home" ? "#1890FF" : undefined }}
                />
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight={600}>Home</Typography>}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={toggleProjects}
              component={RouterLink}
              to="/projetos"
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Projetos" />
              {showProjects ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>

          {/* names project */}
          <Collapse in={showProjects} timeout="auto" unmountOnExit>
            {projetos.map((project: any) => (
              <ListItem key={project.id} disablePadding sx={{ pl: 4 }}>
                <ListItemButton
                  component={RouterLink}
                  to={`/projetos/${project.id}/suites-de-teste`}
                  sx={{ borderRadius: 2, mb: 1 }}
                >
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary={project.nome} />
                </ListItemButton>
              </ListItem>
            ))}
          </Collapse>

          {/* <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton
              component={RouterLink}
              to="/projetos/1/suites-de-teste"
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Suites de Teste" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ pl: 4 }}>
            <ListItemButton
              component={RouterLink}
              to="/projetos/1/casos-de-teste"
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Casos de Teste" />
            </ListItemButton>
          </ListItem> */}
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/projetos/1/relatorios"
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Relatorios" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/projetos/1/dashboard"
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/permissoes"
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Permissões" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/configuracoes"
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Configurações" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/login"
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText onClick={signOut} primary="Sair" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
