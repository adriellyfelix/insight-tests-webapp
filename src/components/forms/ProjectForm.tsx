import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
} from '@mui/material'
import type { Projeto } from '../../types'

interface ProjectFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (projeto: Omit<Projeto, 'id'>) => void
  projeto?: Projeto
}

const statusOptions = [
  'Em Planejamento',
  'Em Andamento',
  'Em Teste',
  'Concluído',
  'Cancelado',
]

const ProjectForm = ({ open, onClose, onSubmit, projeto }: ProjectFormProps) => {
  const [formData, setFormData] = useState<Omit<Projeto, 'id'>>({
    nome: '',
    descricao: '',
    status: 'Em Planejamento',
    versao: '1.0.0',
    metadados: {},
  })

  useEffect(() => {
    if (projeto) {
      setFormData({
        nome: projeto.nome,
        descricao: projeto.descricao,
        status: projeto.status,
        versao: projeto.versao,
        metadados: projeto.metadados,
      })
    }
  }, [projeto])

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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {projeto ? 'Editar Projeto' : 'Novo Projeto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="nome"
                label="Nome"
                value={formData.nome}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="descricao"
                label="Descrição"
                value={formData.descricao}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="versao"
                label="Versão"
                value={formData.versao}
                onChange={handleChange}
                fullWidth
                required
                placeholder="1.0.0"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {projeto ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ProjectForm 