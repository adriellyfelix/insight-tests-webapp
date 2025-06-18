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
import type { ExecucaoTeste } from '../../types'

interface TestExecutionFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (execucao: Omit<ExecucaoTeste, 'id'>) => void
  execucao?: ExecucaoTeste
  casoDeTesteId: number
}

const statusOptions = ['passou', 'falhou', 'bloqueado']

const TestExecutionForm = ({ open, onClose, onSubmit, execucao, casoDeTesteId }: TestExecutionFormProps) => {
  const [formData, setFormData] = useState<Omit<ExecucaoTeste, 'id'>>({
    status: 'passou',
    ambiente: '',
    versao: '1.0.0',
    observacao: '',
    metadados: {},
    casoDeTesteId,
    suiteDeTesteId: 0,
  })

  useEffect(() => {
    if (execucao) {
      setFormData({
        status: execucao.status,
        ambiente: execucao.ambiente,
        versao: execucao.versao,
        observacao: execucao.observacao,
        metadados: execucao.metadados,
        casoDeTesteId: execucao.casoDeTesteId,
        suiteDeTesteId: execucao.suiteDeTesteId,
      })
    }
  }, [execucao])

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
          {execucao ? 'Editar Execução de Teste' : 'Nova Execução de Teste'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 1 }}>
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
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                name="ambiente"
                label="Ambiente"
                value={formData.ambiente}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Ex: Desenvolvimento, Homologação, Produção"
              />
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
              <TextField
                name="observacao"
                label="Observação"
                value={formData.observacao}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                helperText="Descreva os resultados da execução do teste"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {execucao ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default TestExecutionForm 