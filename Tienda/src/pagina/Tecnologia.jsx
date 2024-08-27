import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { TabView, TabPanel } from 'primereact/tabview';
import VGeneral from '../Historial/VGeneral';
import VProductos from '../Historial/VProductos';
import VClientes from '../Historial/VClientes';
import VVentas from '../Historial/VVentas';

export default function Tecnologia(userId) {
  return (
    <>
      <h1>Historial de ventas</h1>
      <div className="flex-container" style={{ marginBottom: '20px' }}>
        <span>Aquí se visualizarán la lista de Venta de Productos</span>
      </div>
      <TabView>
          <TabPanel header="Vista General">
            <VGeneral userId={userId}/>
          </TabPanel>
          <TabPanel header="Vista Productos">
            <VProductos/>
          </TabPanel>
          <TabPanel header="Vista Clientes">
            <VClientes/>
          </TabPanel>
          <TabPanel header="Vista Ventas">
            <VVentas/>
          </TabPanel>
      </TabView>
    </>
  );
}
