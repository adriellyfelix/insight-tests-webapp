import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
} from '@mui/material'
import type { Bug } from '../../types'

interface BugFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (bug: Omit<Bug, 'id'>) => void
  bug?: Bug
  projetoId: number
}

const severidadeOptions = ['Crítica', 'Alta', 'Média', 'Baixa']
const statusOptions = ['Aberto', 'Em Análise', 'Em Desenvolvimento', 'Em Teste', 'Resolvido', 'Fechado']

const BugForm = ({ open, onClose, onSubmit, bug, projetoId }: BugFormProps) => {
  const [formData, setFormData] = useState<Omit<Bug, 'id'>>({
    titulo: '',
    descricao: '',
    severidade: 'Média',
    status: 'Aberto',
    causaRaiz: '',
    acaoCorretiva: '',
    versao: '1.0.0',
    metadados: {},
    projetoId,
  })

  useEffect(() => {
    if (bug) {
      setFormData({
        titulo: bug.titulo,
        descricao: bug.descricao,
        severidade: bug.severidade,
        status: bug.status,
        causaRaiz: bug.causaRaiz,
        acaoCorretiva: bug.acaoCorretiva,
        versao: bug.versao,
        metadados: bug.metadados,
        projetoId: bug.projetoId,
      })
    }
  }, [bug])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {bug ? 'Editar Bug' : 'Novo Bug'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 1 }}>
            <Box sx={{ gridColumn: 'span 2' }}>
              <TextField
                name="titulo"
                label="Título"
                value={formData.titulo}
                onChange={handleChange}
                fullWidth
                required
              />
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              <TextField
                name="descricao"
                label="Descrição"
                value={formData.descricao}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              <TextField
                name="causaRaiz"
                label="Causa Raiz"
                value={formData.causaRaiz}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              <TextField
                name="acaoCorretiva"
                label="Ação Corretiva"
                value={formData.acaoCorretiva}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Box>
            <Box>
              <TextField
                name="severidade"
                label="Severidade"
                value={formData.severidade}
                onChange={handleChange}
                select
                fullWidth
                required
              >
                {severidadeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                name="status"
                label="Status"
                value={formData.status}
                onChange={handleChange}
                select
                fullWidth
                required
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              <TextField
                name="versao"
                label="Versão"
                value={formData.versao}
                onChange={handleChange}
                fullWidth
                required
                placeholder="1.0.0"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {bug ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default BugForm 