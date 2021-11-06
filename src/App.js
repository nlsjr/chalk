import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from './components/Dashboard'
import Institution from "./components/Institution";
import BuyTokens from "./components/BuyTokens";
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme'

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <Routes>
                <Route path="/" element={<Dashboard />}/>
                <Route path="/institution" element={<Institution />}/>
                <Route path="/buy" element={<BuyTokens />}/>
            </Routes>
        </ThemeProvider>
    );
  }