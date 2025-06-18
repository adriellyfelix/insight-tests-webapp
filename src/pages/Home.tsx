import React from 'react'
import { Box, Typography, Button, TextField, AppBar, Toolbar, Link, InputAdornment } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
  const navigate = useNavigate()
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFFFFF' }}>
      {/* Navbar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#FFFFFF', color: '#3B3472', boxShadow: 'none', py: 2 }}>
        <Toolbar sx={{ justifyContent: 'flex-start', gap: 6 }}>
          <Link href="/" underline="none" sx={{ color: '#3B3472', fontWeight: 700, fontSize: 20 }}>
            Home
          </Link>
          <Link href="#about" underline="none" sx={{ color: '#3B3472', fontWeight: 700, fontSize: 20 }}>
            Sobre
          </Link>
          <Link href="#contact" underline="none" sx={{ color: '#3B3472', fontWeight: 700, fontSize: 20 }}>
            Entre em contato conosco
          </Link>
          <Link href="#support" underline="none" sx={{ color: '#3B3472', fontWeight: 700, fontSize: 20 }}>
            Suporte
          </Link>
        </Toolbar>
      </AppBar>
      {/* Conteúdo principal */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'stretch', justifyContent: 'space-between', px: { xs: 2, md: 10 }, py: 6, minHeight: '80vh' }}>
        {/* Lado esquerdo */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 600, pr: { md: 8 } }}>
          <Typography variant="h2" fontWeight={900} color="#3B3472" mb={2} sx={{ fontSize: { xs: 32, md: 48 } }}>
            BEM VINDO AO INSIGHTS TEST
          </Typography>
          <Typography color="#A0A0B2" mb={4} fontSize={20}>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#FFB44F',
              color: '#fff',
              fontWeight: 700,
              fontSize: 20,
              borderRadius: 2,
              px: 4,
              py: 1.5,
              mt: 2,
              boxShadow: 'none',
              width: 'fit-content',
              '&:hover': { bgcolor: '#FFA726' },
            }}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </Box>
        {/* Lado direito: Ilustração */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: { xs: 6, md: 0 } }}>
          <img
            src="/registration-illustration.png"
            alt="Registration Illustration"
            style={{ maxWidth: 520, width: '100%', height: 'auto' }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default Home 