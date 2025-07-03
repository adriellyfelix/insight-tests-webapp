import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Button,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import Sidebar from "../components/Sidebar";
import { authApi, permissionsApi } from "../services/api";
import type { Permission, User } from "../types";
import useProject from "../hooks/useProject";

const Permissions: React.FC = () => {
  const [userList, setUserList] = useState<User[]>();
  const [openModal, setOpenModal] = useState<boolean>();
  const [permissionType, setPermissionType] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  useEffect(() => {
    fetchUsers();
  }, []);
  const { projetos } = useProject();
  const fetchUsers = async () => {
    try {
      const response = await authApi.listarUsuarios();
      setUserList(response.data);
    } catch (error) {
      console.error("Erro ao listar usuários", error);
    }
  };
  const createPermission = async (userId: string) => {
    try {
      const payload = {
        projeto_id: projectId,
        tipo: permissionType,
        usuario_id: userId,
      } as Permission;
      await permissionsApi.create(payload);
      setOpenModal(false);
    } catch (error) {
      console.error("Erro ao criar permissão:", error);
    }
  };
  const handleOpenModal = (id: string) => {
    setOpenModal(true);
    setUserId(id);
  };

  return (
    <Box style={{ display: "flex" }}>
      <Sidebar selected="permissoes" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
          padding: "12px",
        }}
      >
        <Typography variant="h5" fontWeight={700} color="#3B5CB8" mb={1}>
          Permissões
        </Typography>
        <Typography color="#555" mb={3} fontSize={18} textAlign="center">
          Usuários:
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Tipo de usuário</TableCell>
              <TableCell>Fornecer pernissão</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.nome}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenModal(user.id)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog open={openModal!} maxWidth="sm" fullWidth>
          <DialogTitle>Permissão</DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <TextField
                name="permissao"
                label="Tipo de permissão"
                value={permissionType}
                onChange={(e) => setPermissionType(e.target.value)}
                select
                fullWidth
                required
              >
                <MenuItem value="sempermissao">Sem permissão</MenuItem>
                <MenuItem value="leitura">Leitura</MenuItem>
                <MenuItem value="escrita">Escrita</MenuItem>
                <MenuItem value="execucao">Execução</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>
              <TextField
                name="projeto_id"
                label="Escolha o projeto"
                select
                onChange={(e) => setProjectId(e.target.value)}
              >
                {projetos.map((projeto) => (
                  <MenuItem key={projeto.id} value={`${projeto.id}`}>
                    {projeto.nome}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenModal(!openModal)}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => createPermission(userId)}
            >
              Adicionar permissão
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Permissions;
