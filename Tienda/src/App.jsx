// App.js

import React, { useState } from 'react';
import './App.css';
import Navbar from './Dashboard/Navar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Tecnologia from './pagina/Tecnologia';
import Gastos from './pagina/gastos';
import Maquinas from './pagina/maquinas';
import Ganancias from './pagina/ganancias';
import PagVenta from './Componentes/PagVenta';
import Login from './Login/login';
import Registro from './Login/registro';
import Sidebar from './Dashboard';
import Productos from './Productos/VProductos';
import VUsuario from './pagina/Usuario';

function App() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const handleProfileImageUpdate = (newImage) => {
    // Actualiza el estado del usuario con la nueva imagen de perfil
    setUser(prevState => ({
      ...prevState,
      fotoPerfil: newImage
    }));
  };

  return (
    <Router>
      <div className="App">
        {user ? (
          <>
            <Navbar userId={user.Id} fotoPerfil={user.fotoPerfil} onLogout={logout} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onLogout={logout} />
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
              <Routes>
                <Route path="/" element={<Navigate to="/principal" />} />
                <Route path="/principal" element={<Productos userId={user.Id} />} />
                <Route path="/tecnologia" element={<Tecnologia userId={user.Id} />} />
                <Route path="/gastos" element={<Gastos />} />
                <Route path="/maquinas" element={<Maquinas userId={user.Id} />} />
                <Route path="/ganancias" element={<Ganancias />} />
                <Route path="/venta" element={<PagVenta />} />
                <Route path="/usuario" element={<VUsuario userId={user.Id} onProfileImageUpdated={handleProfileImageUpdate} />} />
              </Routes>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/registro" element={<Registro />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
