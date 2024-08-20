import React from 'react';
import '../css/Sidebar.css'; // Asegúrate de crear y definir estilos en Sidebar.css
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ isOpen, toggleSidebar, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes añadir lógica adicional para el cierre de sesión si es necesario
    onLogout(); // Llama a la función que maneja el cierre de sesión
    navigate('/login'); // Redirige al usuario al componente de inicio de sesión
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <ul className="sidebar-menu" style={{ marginTop: '160px' }}>
          <li onClick={() => navigate('/')}>
            <i className="pi pi-home" style={{ fontSize: '20px' }} />
            {isOpen && <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Productos</span>}
          </li>
          <li onClick={() => navigate('/tecnologia')}>
            <i className="pi pi-info-circle" style={{ fontSize: '20px' }} />
            {isOpen && <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Historial</span>}
          </li>
          <li onClick={() => navigate('/gastos')}>
            <i className="pi pi-envelope" style={{ fontSize: '20px' }} />
            {isOpen && <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Gastos</span>}
          </li>
          <li onClick={() => navigate('/ganancias')}>
            <i className="pi pi-envelope" style={{ fontSize: '20px' }} />
            {isOpen && <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Ganancias</span>}
          </li>
          <li onClick={() => navigate('/maquinas')}>
            <i className="pi pi-cog" style={{ fontSize: '20px' }} />
            {isOpen && <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Interfases</span>}
          </li>
          <li onClick={handleLogout}>
            <i className="pi pi-sign-out" style={{ fontSize: '20px' }} />
            {isOpen && <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Cerrar Sesión</span>}
          </li>
        </ul>
      </div>
      <Button
        rounded
        icon={isOpen ? 'pi pi-arrow-left' : 'pi pi-arrow-right'}
        onClick={toggleSidebar}
        className="toggle-button"
        style={{
          left: isOpen ? '180px' : '40px', // Ajuste de posición del botón
          zIndex: 200, // Asegura que el botón esté encima del contenido
        }}
      />
    </>
  );
}
