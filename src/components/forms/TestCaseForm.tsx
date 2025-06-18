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
import type { CasoDeTeste } from '../../types'

interface TestCaseFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (testCase: Omit<CasoDeTeste, 'id'>) => void
  testCase?: CasoDeTeste
  projetoId: number
  suiteId: number
}

const prioridadeOptions = ['Alta', 'Média', 'Baixa']
const tipoOptions = ['Funcional', 'Integração', 'Sistema', 'Aceitação', 'Regressão']

const TestCaseForm = ({ open, onClose, onSubmit, testCase, projetoId, suiteId }: TestCaseFormProps) => {
  const [formData, setFormData] = useState<Omit<CasoDeTeste, 'id'>>({
    titulo: '',
    descricao: '',
    preCondicoes: '',
    passos: '',
    resultadoEsperado: '',
    prioridade: 'Média',
    tipo: 'Funcional',
    ativo: true,
    versao: '1.0.0',
    metadados: {},
    projetoId,
    suiteId,
  })

  useEffect(() => {
    if (testCase) {
      setFormData({
        titulo: testCase.titulo,
        descricao: testCase.descricao,
        preCondicoes: testCase.preCondicoes,
        passos: testCase.passos,
        resultadoEsperado: testCase.resultadoEsperado,
        prioridade: testCase.prioridade,
        tipo: testCase.tipo,
        ativo: testCase.ativo,
        versao: testCase.versao,
        metadados: testCase.metadados,
        projetoId: testCase.projetoId,
        suiteId: testCase.suiteId,
      })
    }
  }, [testCase])

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
          {testCase ? 'Editar Caso de Teste' : 'Novo Caso de Teste'}
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
                name="preCondicoes"
                label="Pré-condições"
                value={formData.preCondicoes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              <TextField
                name="passos"
                label="Passos"
                value={formData.passos}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              <TextField
                name="resultadoEsperado"
                label="Resultado Esperado"
                value={formData.resultadoEsperado}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Box>
            <Box>
              <TextField
                name="prioridade"
                label="Prioridade"
                value={formData.prioridade}
                onChange={handleChange}
                select
                fullWidth
                required
              >
                {prioridadeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
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
                    checked={formData.ativo}
                    onChange={handleChange}
                    name="ativo"
                    color="primary"
                  />
                }
                label="Ativo"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {testCase ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default TestCaseForm 