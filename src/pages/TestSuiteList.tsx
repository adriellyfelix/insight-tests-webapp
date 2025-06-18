import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { TreeView, TreeItem } from '@mui/lab'
import { suitesMock, casosMock } from '../mocks/data'
import Sidebar from '../components/Sidebar'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const TestSuiteList: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFB' }}>
      <Sidebar selected="suites" />
      <Box sx={{ flex: 1, p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Suites de Teste
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            {suitesMock.map((suite) => (
              <TreeItem nodeId={suite.id} label={suite.nome} key={suite.id}>
                {casosMock
                  .filter((caso) => caso.suite_id === suite.id)
                  .map((caso) => (
                    <TreeItem
                      nodeId={caso.id}
                      label={caso.titulo}
                      key={caso.id}
                    />
                  ))}
              </TreeItem>
            ))}
          </TreeView>
        </Paper>
      </Box>
    </Box>
  )
}

export default TestSuiteList 