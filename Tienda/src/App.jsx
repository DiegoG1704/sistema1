import { useState } from 'react';
import './App.css';
import Navbar from './Dashboard/Navar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Principal from './pagina/Principal';
import Tecnologia from './pagina/Tecnologia';
import Gastos from './pagina/gastos';
import Maquinas from './pagina/maquinas';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Ganancias from './pagina/ganancias';
import PagVenta from './Componentes/PagVenta';
import Login from './Login/login';
import Registro from './Login/registro';
import Sidebar from './Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const loginUser = () => {
    setIsAuthenticated(true); // Simula la autenticación
  };

  const logoutUser = () => {
    setIsAuthenticated(false); // Simula el cierre de sesión
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated ? (
          <>
            <Navbar />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onLogout={logoutUser} />
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
              <Routes>
                <Route path="/" element={<Navigate to="/principal" />} />
                <Route path="/principal" element={<Principal />} />
                <Route path="/tecnologia" element={<Tecnologia />} />
                <Route path="/gastos" element={<Gastos />} />
                <Route path="/maquinas" element={<Maquinas />} />
                <Route path="/ganancias" element={<Ganancias />} />
                <Route path="/venta" element={<PagVenta />} />
              </Routes>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login onLogin={loginUser} />} />
            <Route path="/registro" element={<Registro />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
