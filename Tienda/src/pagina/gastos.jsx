import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Accordion, AccordionTab } from 'primereact/accordion';
import PagMat from '../Componentes/PagMat';
import PagSer from '../Componentes/PagSer';
import PagTrab from '../Componentes/PagTrab';
import axios from 'axios';

export default function Gastos() {
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [gastosDiarios, setGastosDiarios] = useState([]);

  useEffect(() => {
    fetchGastosDiarios();
  }, []);

  const fetchGastosDiarios = async () => {
    try {
      const response = await axios.get('http://localhost:8081/gastosDiarios');
      setGastosDiarios(response.data);
    } catch (error) {
      console.error('Error fetching gastos diarios:', error);
    }
  };

  const handleAgregarGastoDiario = async () => {
    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    try {
      const response = await axios.post('http://localhost:8081/gastosDiarios', { Fecha: today });
      setGastosDiarios([...gastosDiarios, response.data]);
    } catch (error) {
      console.error('Error adding gasto diario:', error);
    }
  };

  const handleEliminarGastoDiario = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/gastosDiarios/${id}`);
      setGastosDiarios(gastosDiarios.filter(gasto => gasto.ID !== id));
    } catch (error) {
      console.error('Error deleting gasto diario:', error);
    }
  };

  const GastosButton = (rowData) => {
    return (
      <Button icon="pi pi-tags" className="p-button-rounded p-button-success p-button-text" onClick={() => setAddDialogVisible(true)} />
    );
  };

  const EliminarButton = (rowData) => {
    return (
      <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => handleEliminarGastoDiario(rowData.ID)} />
    );
  };

  return (
    <>
      <h1>Bienvenido Página de Gastos</h1>
      <div className="flex-container" style={{ marginBottom: '20px' }}>
        <span>Aquí se visualizarán la lista de los Gastos</span>
        <Button label="Agregar gasto de hoy" icon="pi pi-plus" className="p-button-raised p-button-success" onClick={handleAgregarGastoDiario} />
      </div>
      <div className="card">
        <DataTable value={gastosDiarios} tableStyle={{ minWidth: '50rem' }}>
          <Column field="Fecha" header="Fecha"></Column>
          <Column body={GastosButton} header="Gastos"></Column>
          <Column field="GastoDiario" header="Gasto total Diario"></Column>
          <Column header="Eliminar" body={EliminarButton}></Column>
        </DataTable>
      </div>

      <Dialog header="Diario" visible={addDialogVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={() => setAddDialogVisible(false)}>
        <h1>Lista de Gastos del día</h1>
        <div className="card">
          <Accordion activeIndex={0}>
            <AccordionTab
              header={
                <span className="flex w-full align-center justify-between">
                  <span className="font-bold white-space-nowrap">Pago de Materiales</span>
                </span>
              }
            >
              <PagMat />
            </AccordionTab>
            <AccordionTab
              header={
                <span className="flex w-full align-center justify-between">
                  <span className="font-bold white-space-nowrap">Pago de Servicios</span>
                </span>
              }
            >
              <PagSer />
            </AccordionTab>
            <AccordionTab
              header={
                <span className="flex w-full align-center justify-between">
                  <span className="font-bold white-space-nowrap">Pago de Trabajadores</span>
                </span>
              }
            >
              <PagTrab />
            </AccordionTab>
          </Accordion>
        </div>
      </Dialog>
    </>
  );
}
