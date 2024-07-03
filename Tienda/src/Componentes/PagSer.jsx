import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

function PagSer() {
  const [GastoD, setGastoD] = useState([
    { id: 1,Servicio: 'Agua', Descripcion: 'Material 1',  Precio: 20},
    { id: 2,Servicio: 'Luz', Descripcion: 'Material 2',  Precio: 50},
    { id: 3,Servicio: 'Comida', Descripcion: 'Material 3',  Precio: 100}
  ]);

  const [agregarVisible, setAgregarVisible] = useState(false);
  const [newGasto, setNewGasto] = useState({});
  const [editDialogVisible, setEditDialogVisible] = useState(false);

  const Servicios = [
    { name: 'Agua', code: 'AG' },
    { name: 'Luz', code: 'LZ' },
    { name: 'Comida', code: 'CD' },
    { name: 'Pasaje', code: 'PJ' }
  ];

  const EditarGButton = (rowData) => {
    return (
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-button-text" onClick={() => setEditDialogVisible(true)} />
    );
  };

  const EliminarGButton = (rowData) => {
    return (
      <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" />
    );
  };

  const handleAddGasto = () => {
    // Add Gasto handling logic here
  };

  const saveEditedGastoDetail = () => {
    // Save edited Gasto handling logic here
  };

  return (
    <>
      <div>
        <Button label="Agregar Gasto" icon="pi pi-plus" className="p-button-raised p-button-success" onClick={() => setAgregarVisible(true)} />
      </div>
      <DataTable value={GastoD} tableStyle={{ minWidth: '50rem' }}>
        <Column field="Servicio" header="Servicio"></Column>
        <Column field="Descripcion" header="Descripcion"></Column>
        <Column field="Precio" header="Precio"></Column>
        <Column header="Editar" body={EditarGButton}></Column>
        <Column header="Eliminar" body={EliminarGButton}></Column>
      </DataTable>

      <Dialog header="Agregar Gasto" visible={agregarVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={() => setAgregarVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="tipoGasto">Servicio</label>
            <Dropdown options={Servicios} optionLabel="name" placeholder="Seleccionar Tipo de Gasto" className="w-full md:w-14rem" />
          </div>
          <div className="p-field">
            <label htmlFor="descripcion">Descripción</label>
            <InputText id="descripcion" />
          </div>
          <div className="p-field">
            <label htmlFor="precioUnitario">Precio</label>
            <InputNumber id="precioUnitario" mode="currency" currency="USD" locale="en-US" />
          </div>
        </div>
        <div className="p-dialog-footer">
          <Button label="Cancelar" className="p-button-danger" onClick={() => setAgregarVisible(false)} />
          <Button label="Guardar" className="p-button-success" />
        </div>
      </Dialog>

      <Dialog header="Editar Gasto" visible={editDialogVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={() => setEditDialogVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="tipoGasto">Servicio</label>
            <Dropdown options={Servicios} optionLabel="name" placeholder="Seleccionar Tipo de Gasto" className="w-full md:w-14rem" />
          </div>
          <div className="p-field">
            <label htmlFor="descripcion">Descripción</label>
            <InputText id="descripcion" />
          </div>
          <div className="p-field">
            <label htmlFor="precioUnitario">Precio</label>
            <InputNumber id="precioUnitario" mode="currency" currency="USD" locale="en-US" />
          </div>
        </div>
        <div className="p-dialog-footer">
          <Button label="Cancelar" className="p-button-danger" onClick={() => setEditDialogVisible(false)} />
          <Button label="Guardar" className="p-button-success" />
        </div>
      </Dialog>
    </>
  );
}

export default PagSer;
