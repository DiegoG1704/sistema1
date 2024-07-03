import React from 'react';
import '../css/navar.css'; // Asegúrate de crear y definir estilos en Navbar.css
import 'primeicons/primeicons.css';
import { InputText } from 'primereact/inputtext';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
      </div>
      {/* <span className="p-input-icon-left navbar-search">
        <i className="pi pi-search" style={{marginTop:'1px'}}/>
        <InputText placeholder="Buscar" type="text" className='flex'/>
      </span> */}
      <ul className="navbar-links">
        <li><a href='#'><i className="pi pi-bell" style={{ color: 'var(--primary-color)' }}></i></a></li>
        <li><a href="#contact">Usuario</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
