// src/Navbar.jsx
import React from 'react';
import '../css/navar.css'; // Asegúrate de crear y definir estilos en Navbar.css
import 'primeicons/primeicons.css';
import { TabView, TabPanel } from 'primereact/tabview';
import Venta from '../Interfaz/venta';
import AgregarVenta from '../Interfaz/prueba';
import Login from '../Login/login';

export default function Maquinas() {
  return (
    <>
      <TabView>
          <TabPanel header="Formulario Ventas">
            <AgregarVenta/>
          </TabPanel>
          <TabPanel header="Header II">
            <Login/>
          </TabPanel>
          <TabPanel header="Header III">
              <p className="m-0">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti 
                  quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
                  culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. 
                  Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
              </p>
          </TabPanel>
      </TabView>
    </>
  );
}

