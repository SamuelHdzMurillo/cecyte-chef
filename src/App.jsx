import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import Login from "./Login.jsx";
import HomePage from "./components/HomePage.jsx";
import RoleBasedRoute from "./components/RoleBasedRoute.jsx";
import HospedajeDetalle from "./components/HospedajeDetalle.jsx";
import ParticipanteDetalle from "./components/ParticipanteDetalle.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Inicio from "./pages/Inicio.jsx";
import Programa from "./pages/Programa.jsx";
import Hospedajes from "./pages/Hospedajes.jsx";
import Restaurantes from "./pages/Restaurantes.jsx";
import QueVisitar from "./pages/QueVisitar.jsx";
import Contacto from "./pages/Contacto.jsx";
import "./App.css";


function App() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={<HomePage onLoginClick={handleLoginClick} />}
        />
        <Route
          path="/inicio"
          element={<Inicio onLoginClick={handleLoginClick} />}
        />
        <Route
          path="/programa"
          element={<Programa onLoginClick={handleLoginClick} />}
        />
        <Route
          path="/hospedajes"
          element={<Hospedajes onLoginClick={handleLoginClick} />}
        />
        <Route
          path="/restaurantes"
          element={<Restaurantes onLoginClick={handleLoginClick} />}
        />
        <Route
          path="/que-visitar"
          element={<QueVisitar onLoginClick={handleLoginClick} />}
        />
        <Route
          path="/contacto"
          element={<Contacto onLoginClick={handleLoginClick} />}
        />
        <Route path="/login" element={<Login onBackClick={handleBackToHome} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospedajes/:id"
          element={
            <ProtectedRoute>
              <HospedajeDetalle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/participantes/:id"
          element={
            <ProtectedRoute>
              <ParticipanteDetalle />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
