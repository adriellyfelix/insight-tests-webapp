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
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import Sidebar from "../components/Sidebar";
import { authApi } from "../services/api";
import type { User } from "../types";
const Permissions: React.FC = () => {
  const [userList, setUserList] = useState<User[]>();

  const fetchUsers = async () => {
    try {
      const response = await authApi.listarUsuarios();
      console.log(response.data);
      setUserList(response.data);
    } catch (error) {
      console.error("Erro ao listar usuários", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
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
              <TableCell>Regra</TableCell>
              <TableCell>Mudar regra</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.nome}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default Permissions;
