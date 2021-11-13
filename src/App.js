import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from './components/Dashboard'
import Institution from "./components/Institution";
import BuyTokens from "./components/BuyTokens";
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme'
import Login from "./components/Login";
import Quotation from "./components/Quotation";

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <Routes>
                <Route path="/" element={<Dashboard />}/>
                <Route path="/institution" element={<Institution />}/>
                <Route path="/buy" element={<BuyTokens />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/quotation" element={<Quotation />}/>
            </Routes>
        </ThemeProvider>
    );
  }