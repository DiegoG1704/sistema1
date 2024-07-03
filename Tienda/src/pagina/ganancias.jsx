// src/Navbar.jsx
import React from 'react';
import '../css/navar.css'; // Asegúrate de crear y definir estilos en Navbar.css
import 'primeicons/primeicons.css';

export default function Ganancias() {
    const EditarButton = (rowData) => {
        return (
          <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-button-text" onClick={() => openEditProductDialog(rowData)} />
        );
      };
    
      const EliminarButton = (rowData) => {
        return (
          <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => setProducts(products.filter(p => p !== rowData))} />
        );
      };
  return (
    <>
    <h1>Lista de Ganancias</h1>
    <div className="flex-container" style={{ marginBottom: '20px' }}>
        <span>Aquí se visualizarán las Ganancias optenidas</span>
        <Button label="Agregar" icon="pi pi-plus" className="p-button-raised p-button-success"  />
      </div>
      <div className="card">
        <DataTable value={products} responsiveLayout="scroll" tableStyle={{ minWidth: '50rem' }}>
          <Column field="Nombre" header="Nombre"></Column>
          <Column field="Precio" header="Precio"></Column>
          <Column field="FechaProduccion" header="Fecha de producción"></Column>
          <Column field="Stock" header="Stock"></Column>
          <Column header="Editar" body={EditarButton}></Column>
          <Column header="Eliminar" body={EliminarButton}></Column>
        </DataTable>
      </div>
    </>
  );
}

