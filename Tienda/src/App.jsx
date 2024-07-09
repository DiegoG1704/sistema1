import { useState } from 'react'
import './App.css'
import Home from './Dashboard'
import Navbar from './Dashboard/Navar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Principal from './pagina/Principal'
import Tecnologia from './pagina/Tecnologia'
import Gastos from './pagina/gastos'
import Maquinas from './pagina/maquinas'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Ganancias from './pagina/ganancias';
import PagVenta from './Componentes/PagVenta';



function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
    <div className="App">
      <Navbar /> {/* Usa el componente Navbar */}
      <Home isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Routes>
          <Route path="/" element={<Principal/>} />
          <Route path="/tecnologia" element={<Tecnologia/>} />
          <Route path="/gastos" element={<Gastos/>} />
          <Route path="/maquinas" element={<Maquinas/>} />
          <Route path="/ganancias" element={<Ganancias/>} />
          <Route path="/venta" element={<PagVenta/>} />
        </Routes>
      </div>
    </div>
  </Router>
  )
}

export default App
