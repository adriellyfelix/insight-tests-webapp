import React, { useEffect, useState } from 'react'
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
  IconButton,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { casosDeTesteApi } from '../services/api'
import type { CasoDeTeste } from '../types'

const TestCaseList: React.FC = () => {
  const [casosDeTeste, setCasosDeTeste] = useState<CasoDeTeste[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadCasosDeTeste()
  }, [])

  const loadCasosDeTeste = async () => {
    try {
      setLoading(true)
      const response = await casosDeTesteApi.listar()
      setCasosDeTeste(response.data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar casos de teste')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: string) => {
    navigate(`/casos-de-teste/${id}`)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este caso de teste?')) {
      try {
        await casosDeTesteApi.excluir(id)
        setCasosDeTeste(casosDeTeste.filter((caso) => caso.id !== id))
      } catch (err) {
        setError('Erro ao excluir caso de teste')
        console.error(err)
      }
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box mt={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Casos de Teste
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Prioridade</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {casosDeTeste.map((caso) => (
              <TableRow key={caso.id}>
                <TableCell>{caso.titulo}</TableCell>
                <TableCell>
                  <Chip
                    label={caso.prioridade}
                    color={
                      caso.prioridade === 'critica'
                        ? 'error'
                        : caso.prioridade === 'alta'
                        ? 'warning'
                        : caso.prioridade === 'media'
                        ? 'info'
                        : 'success'
                    }
                  />
                </TableCell>
                <TableCell>{caso.tipo}</TableCell>
                <TableCell>
                  <Chip
                    label={caso.ativo ? 'Ativo' : 'Inativo'}
                    color={caso.ativo ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(caso.id)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(caso.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default TestCaseList 