import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import Paper from '@mui/material/Paper';

import TableInstitution from './TableInstitution';
import MenuDrawer from './MenuDrawer';


function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const title = "Dashboard"
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <MenuDrawer open={open} handleDrawerClose={toggleDrawer} title={title}/>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                  <Grid item xs={12}>
                      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                          <TableInstitution />
                      </Paper>
                  </Grid>
              </Grid>
          </Container>
      </Box>
    </Box>
  );
}

export default function Dashboard() {
    return <DashboardContent />;
}