// src/components/ReportScreen.js

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Reporte from './Reporte';

const ReportScreen = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuItemClick = (text) => {
    console.log(`Clicked on ${text}`);
  };

  const menuItems = ['Dashboard', 'Reportes', 'Configuraciones'];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      {/* Barra de Navegación Superior */}
      <AppBar position="fixed" sx={{ zIndex: 1100 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: { xs: '1rem', sm: '1.5rem' } }}>
            Sistema Administrativo X
          </Typography>
          <span color="inherit">Módulo de reportes X</span>
        </Toolbar>
      </AppBar>

      {/* Menú Deslizable */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer} sx={{ zIndex: 1000 }}>
        <div role="presentation" onClick={toggleDrawer} onKeyDown={toggleDrawer}>
          <List  sx={{ pt: 8 }}>
            {menuItems.map((text, index) => (
              <ListItem button key={text} onClick={() => handleMenuItemClick(text)}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </div>
      </Drawer>

      {/* Contenido Principal */}
      <Box sx={{ p: 2, flexGrow: 2, bgcolor: 'background.default', pt: 8 }} >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Reportes
          <Reporte />
        </Typography>
        {/* Aquí puedes añadir los componentes de reportes */}
      </Box>
    </Box>
  );
};

export default ReportScreen;