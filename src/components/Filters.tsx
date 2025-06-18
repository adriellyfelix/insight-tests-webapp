import { useState } from 'react'
import {
  Paper,
  TextField,
  MenuItem,
  Button,
  Box,
} from '@mui/material'

interface FilterOption {
  label: string
  value: string
}

interface FiltersProps {
  filters: {
    id?: boolean
    status?: FilterOption[]
    tipo?: FilterOption[]
    prioridade?: FilterOption[]
    severidade?: FilterOption[]
    ambiente?: FilterOption[]
  }
  onFilter: (filters: Record<string, string>) => void
}

const Filters = ({ filters, onFilter }: FiltersProps) => {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilterValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter(filterValues)
  }

  const handleClear = () => {
    setFilterValues({})
    onFilter({})
  }

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
          {filters.id && (
            <Box>
              <TextField
                name="id"
                label="ID"
                value={filterValues.id || ''}
                onChange={handleChange}
                fullWidth
                type="number"
              />
            </Box>
          )}

          {filters.status && (
            <Box>
              <TextField
                name="status"
                label="Status"
                value={filterValues.status || ''}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">Todos</MenuItem>
                {filters.status.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}

          {filters.tipo && (
            <Box>
              <TextField
                name="tipo"
                label="Tipo"
                value={filterValues.tipo || ''}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">Todos</MenuItem>
                {filters.tipo.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}

          {filters.prioridade && (
            <Box>
              <TextField
                name="prioridade"
                label="Prioridade"
                value={filterValues.prioridade || ''}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">Todas</MenuItem>
                {filters.prioridade.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}

          {filters.severidade && (
            <Box>
              <TextField
                name="severidade"
                label="Severidade"
                value={filterValues.severidade || ''}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">Todas</MenuItem>
                {filters.severidade.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}

          {filters.ambiente && (
            <Box>
              <TextField
                name="ambiente"
                label="Ambiente"
                value={filterValues.ambiente || ''}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value="">Todos</MenuItem>
                {filters.ambiente.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}

          <Box sx={{ gridColumn: 'span 4', display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleClear}>
              Limpar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Filtrar
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  )
}

export default Filters 