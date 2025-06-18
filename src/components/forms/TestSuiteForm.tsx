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
  FormControlLabel,
  Switch,
} from '@mui/material'
import type { SuiteDeTeste } from '../../types'

interface TestSuiteFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (suite: Omit<SuiteDeTeste, 'id'>) => void
  suite?: SuiteDeTeste
  projetoId: number
}

const tipoOptions = ['Funcional', 'Integração', 'Sistema', 'Aceitação', 'Regressão']

const TestSuiteForm = ({ open, onClose, onSubmit, suite, projetoId }: TestSuiteFormProps) => {
  const [formData, setFormData] = useState<Omit<SuiteDeTeste, 'id'>>({
    nome: '',
    descricao: '',
    tipo: 'Funcional',
    ativa: true,
    versao: '1.0.0',
    metadados: {},
    projetoId,
  })

  useEffect(() => {
    if (suite) {
      setFormData({
        nome: suite.nome,
        descricao: suite.descricao,
        tipo: suite.tipo,
        ativa: suite.ativa,
        versao: suite.versao,
        metadados: suite.metadados,
        projetoId: suite.projetoId,
      })
    }
  }, [suite])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
          {suite ? 'Editar Suite de Teste' : 'Nova Suite de Teste'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 1 }}>
            <Box sx={{ gridColumn: 'span 2' }}>
              <TextField
                name="nome"
                label="Nome"
                value={formData.nome}
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
            <Box>
              <TextField
                name="tipo"
                label="Tipo"
                value={formData.tipo}
                onChange={handleChange}
                select
                fullWidth
                required
              >
                {tipoOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
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
            <Box sx={{ gridColumn: 'span 2' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.ativa}
                    onChange={handleChange}
                    name="ativa"
                    color="primary"
                  />
                }
                label="Ativa"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {suite ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default TestSuiteForm 