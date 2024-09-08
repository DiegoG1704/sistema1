import React, { useState, useEffect, useRef } from 'react'; // Importa useState y useEffect
import '../css/navar.css'; 
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importa axios para las llamadas a la API

function Navbar({ userId, fotoPerfil, onLogout }) {
  const menuRight = useRef(null);
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({}); // Inicializa el estado del usuario

  const handleLogout = () => {
    onLogout(); // Llama a la función que maneja el cierre de sesión
    navigate('/login'); // Redirige al usuario al componente de inicio de sesión
  };

  const fetchUsuario = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/Usuario/${userId}`);
      setUsuario(response.data);
    } catch (error) {
      console.error('Error al obtener Usuario:', error);
    }
  };

  useEffect(() => {
    fetchUsuario();
  }, [userId]);

  const items = [
    {
      label: usuario.NombreUsuario ? `Hola, ${usuario.NombreUsuario}` : 'Usuario', // Muestra el nombre del usuario si está disponible
      items: [
        {
          label: 'Gestionar cuenta', // Agrega la opción "Gestionar cuenta"
          icon: 'pi pi-user',
          command: () => navigate('/usuario'), // Redirige a "/usuario"
        },
        {
          label: 'Cerrar Sesion',
          icon: 'pi pi-power-off',
          command: handleLogout
        }
      ]
    }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {/* Puedes colocar aquí un logo o título */}
      </div>
      
      <ul className="navbar-links">
        <li>
          <a href="#"><i className="pi pi-bell" style={{ color: 'var(--primary-color)' }}></i></a>
        </li>
        <li>
          <Button 
            className="user-button" 
            onClick={(event) => menuRight.current.toggle(event)} 
            aria-controls="popup_menu_right" 
            aria-haspopup 
          >
            <img 
              src={fotoPerfil ? `http://localhost:8081/uploads/${fotoPerfil}` : '../img/user.png'} 
              alt="User" 
              className="user-icon" 
            />
          </Button>
          <Menu 
            model={items} 
            popup 
            ref={menuRight} 
            id="popup_menu_right" 
          />
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
