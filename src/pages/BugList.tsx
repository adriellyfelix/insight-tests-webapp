import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
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
  Chip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { bugsApi } from '../services/api'
import type { Bug } from '../types'

const BugList = () => {
  const { projetoId } = useParams()
  const [bugs, setBugs] = useState<Bug[]>([])

  useEffect(() => {
    const fetchBugs = async () => {
      if (projetoId) {
        try {
          const response = await bugsApi.listar(parseInt(projetoId))
          setBugs(response.data)
        } catch (error) {
          console.error('Erro ao carregar bugs:', error)
        }
      }
    }
    fetchBugs()
  }, [projetoId])

  const getSeveridadeColor = (severidade: string) => {
    switch (severidade.toLowerCase()) {
      case 'crítica':
        return 'error'
      case 'alta':
        return 'error'
      case 'média':
        return 'warning'
      case 'baixa':
        return 'success'
      default:
        return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aberto':
        return 'error'
      case 'em andamento':
        return 'warning'
      case 'resolvido':
        return 'success'
      case 'fechado':
        return 'default'
      default:
        return 'default'
    }
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Bugs
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
      >
        Novo Bug
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Severidade</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Versão</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bugs.map((bug) => (
              <TableRow key={bug.id}>
                <TableCell>{bug.id}</TableCell>
                <TableCell>{bug.titulo}</TableCell>
                <TableCell>
                  <Chip
                    label={bug.severidade}
                    color={getSeveridadeColor(bug.severidade)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={bug.status}
                    color={getStatusColor(bug.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{bug.versao}</TableCell>
                <TableCell>
                  <Button size="small" color="primary">
                    Editar
                  </Button>
                  <Button size="small" color="error">
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default BugList 