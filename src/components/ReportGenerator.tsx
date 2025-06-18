import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import ptBR from 'date-fns/locale/pt-BR'

interface ReportGeneratorProps {
  open: boolean
  onClose: () => void
  projetoId: number
}

type ReportType = 'testes' | 'bugs' | 'execucoes' | 'cobertura'

const ReportGenerator = ({ open, onClose, projetoId }: ReportGeneratorProps) => {
  const [tipoRelatorio, setTipoRelatorio] = useState<ReportType>('testes')
  const [dataInicio, setDataInicio] = useState<Date | null>(null)
  const [dataFim, setDataFim] = useState<Date | null>(null)
  const [formato, setFormato] = useState<'pdf' | 'excel'>('pdf')

  const handleGenerate = async () => {
    try {
      // Implementar geração do relatório
      console.log('Gerando relatório:', {
        tipoRelatorio,
        dataInicio,
        dataFim,
        formato,
        projetoId,
      })
      onClose()
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Gerar Relatório</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Relatório</InputLabel>
            <Select
              value={tipoRelatorio}
              label="Tipo de Relatório"
              onChange={(e) => setTipoRelatorio(e.target.value as ReportType)}
            >
              <MenuItem value="testes">Casos de Teste</MenuItem>
              <MenuItem value="bugs">Bugs</MenuItem>
              <MenuItem value="execucoes">Execuções</MenuItem>
              <MenuItem value="cobertura">Cobertura de Testes</MenuItem>
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DatePicker
              label="Data Início"
              value={dataInicio}
              onChange={(newValue) => setDataInicio(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DatePicker
              label="Data Fim"
              value={dataFim}
              onChange={(newValue) => setDataFim(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <FormControl fullWidth>
            <InputLabel>Formato</InputLabel>
            <Select
              value={formato}
              label="Formato"
              onChange={(e) => setFormato(e.target.value as 'pdf' | 'excel')}
            >
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="excel">Excel</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleGenerate} variant="contained" color="primary">
          Gerar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ReportGenerator 