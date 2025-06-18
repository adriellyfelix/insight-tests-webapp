import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import Sidebar from '../components/Sidebar'

const Reports: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFB' }}>
      <Sidebar selected="relatorios" />
      <Box sx={{ flex: 1, p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={0} sx={{ bgcolor: 'transparent', boxShadow: 'none', p: 6, width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={700} color="#3B5CB8" mb={1}>
            Relatórios
          </Typography>
          <Typography color="#555" mb={3} fontSize={18} textAlign="center">
            Em breve você poderá gerar e visualizar relatórios personalizados.
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
}

export default Reports 