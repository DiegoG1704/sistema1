import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { TabView, TabPanel } from 'primereact/tabview';
import VGeneral from '../Historial/VGeneral';
import VProductos from '../Historial/VProductos';

export default function Tecnologia() {
  return (
    <>
      <h1>Historial de ventas</h1>
      <div className="flex-container" style={{ marginBottom: '20px' }}>
        <span>Aquí se visualizarán la lista de los Materiales necesarios</span>
      </div>
      <TabView>
          <TabPanel header="Vista General">
            <VGeneral/>
          </TabPanel>
          <TabPanel header="Header II">
            <VProductos/>
          </TabPanel>
          <TabPanel header="Header III">
            <h1>I3</h1>
          </TabPanel>
      </TabView>
    </>
  );
}
