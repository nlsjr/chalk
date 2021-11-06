import * as React from 'react';

import { styled } from '@mui/material/styles';
import { Toolbar, IconButton, Divider, List, Typography, Badge} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import {ChevronLeft, Menu, Notifications} from '@mui/icons-material';
import { ListItems } from './ListItems';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));
  
  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
      ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
          position: 'relative',
          whiteSpace: 'nowrap',
          width: drawerWidth,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          boxSizing: 'border-box',
          ...(!open && {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
              width: theme.spacing(9),
            },
          }),
        },
      }),
    );
  

export default function MenuDrawer(props) {
    const { open, handleDrawerClose, title } = props

    return (
        <>
            <AppBar position="absolute" open={open}>
                <Toolbar sx={{
                    pr: '24px', // keep right padding when drawer closed
                }}>
                <IconButton
                    edge="start"
                    color="secondary"
                    aria-label="open drawer"
                    onClick={handleDrawerClose}
                    sx={{
                    marginRight: '36px',
                    ...(open && { display: 'none' }),
                    }}
                >
                <Menu />
                </IconButton>
                <Typography
                    component="h1"
                    variant="h6"
                    color="white"
                    noWrap
                    sx={{ flexGrow: 1 }}
                >
                    {title}
                </Typography>
                <IconButton color="inherit">
                    <Badge badgeContent={4} color="secondary">
                    <Notifications />
                    </Badge>
                </IconButton>
                </Toolbar>
            </AppBar>
        <Drawer variant="permanent" open={open}>
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                }}
                >
                <IconButton onClick={handleDrawerClose} >
                    <ChevronLeft />
                </IconButton>
            </Toolbar>
            <Divider />
            <List>{ListItems}</List>
            <Divider />
        </Drawer>
        </>
    );
}