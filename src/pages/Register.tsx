import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [nome, setName] = useState("");
  const [senha, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(nome, email, senha);
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", maxWidth: "100%", bgcolor: "#FFFF" }}>
      {/* Navbar */}

      {/* Conteúdo principal */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
          justifyContent: "space-between",
          px: { xs: 2, md: 10 },
          py: 6,
          minHeight: "80vh",
        }}
      >
        {/* Lado direito: Formulário */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 0,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#fff",
              boxShadow: "none",
              p: 6,
              width: "100%",
              maxWidth: 420,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 4,
            }}
          >
            <Typography variant="h4" fontWeight={900} color="#3B3472" mb={2}>
              Registro
            </Typography>
            <Typography color="#A0A0B2" mb={3} fontSize={18} textAlign="center">
              Faça o cadastr para acessar sua conta e gerenciar seus testes.
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField
                label="nome"
                variant="filled"
                fullWidth
                margin="normal"
                value={nome}
                onChange={(e) => setName(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    bgcolor: "#E6E6FA",
                    borderRadius: 2,
                    color: "#3B3472",
                    fontSize: 18,
                    px: 2,
                    height: 48,
                  },
                }}
                InputLabelProps={{
                  style: { color: "#3B3472", fontWeight: 500 },
                }}
              />

              <TextField
                label="email"
                variant="filled"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    bgcolor: "#E6E6FA",
                    borderRadius: 2,
                    color: "#3B3472",
                    fontSize: 18,
                    px: 2,
                    height: 48,
                  },
                }}
                InputLabelProps={{
                  style: { color: "#3B3472", fontWeight: 500 },
                }}
              />
              <TextField
                label="Senha"
                type="password"
                variant="filled"
                fullWidth
                margin="normal"
                value={senha}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    bgcolor: "#E6E6FA",
                    borderRadius: 2,
                    color: "#3B3472",
                    fontSize: 18,
                    px: 2,
                    height: 48,
                  },
                }}
                InputLabelProps={{
                  style: { color: "#3B3472", fontWeight: 500 },
                }}
              />
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <a href="/login">Já tem uma conta?</a>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  bgcolor: "#FFB44F",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 20,
                  borderRadius: 2,
                  py: 1.5,
                  mt: 2,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#FFA726" },
                }}
                disabled={loading}
              >
                Cadastrar
              </Button>
            </form>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
