import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

function PagTrab() {
  const [GastoD, setGastoD] = useState([
    { id: 1, Descripcion: 'Material 1', TipoGasto: 'Material', Cantidad: 5, PrecioUnitario: 20, PrecioTotal: 100 },
    { id: 2, Descripcion: 'Material 2', TipoGasto: 'Material', Cantidad: 3, PrecioUnitario: 50, PrecioTotal: 150 },
    { id: 3, Descripcion: 'Material 3', TipoGasto: 'Material', Cantidad: 2, PrecioUnitario: 100, PrecioTotal: 200 }
  ]);

  const [agregarVisible, setAgregarVisible] = useState(false);
  const [newGasto, setNewGasto] = useState({});
  const [editDialogVisible, setEditDialogVisible] = useState(false);

  const TipoGastos = [
    { name: 'Material', code: 'MT' },
    { name: 'Comida', code: 'CD' },
    { name: 'Otros', code: 'OS' },
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
        <Column field="Descripcion" header="Descripción"></Column>
        <Column field="TipoGasto" header="Tipo de Gasto"></Column>
        <Column field="Cantidad" header="Cantidad"></Column>
        <Column field="PrecioUnitario" header="Precio Unitario"></Column>
        <Column field="PrecioTotal" header="Precio Total"></Column>
        <Column header="Editar" body={EditarGButton}></Column>
        <Column header="Eliminar" body={EliminarGButton}></Column>
      </DataTable>

      <Dialog header="Agregar Gasto" visible={agregarVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={() => setAgregarVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="tipoGasto">Gasto</label>
            <Dropdown options={TipoGastos} optionLabel="name" placeholder="Seleccionar Tipo de Gasto" className="w-full md:w-14rem" />
          </div>
          <div className="p-field">
            <label htmlFor="descripcion">Descripción</label>
            <InputText id="descripcion" />
          </div>
          <div className="p-field">
            <label htmlFor="cantidad">Cantidad</label>
            <InputNumber id="cantidad" />
          </div>
          <div className="p-field">
            <label htmlFor="precioUnitario">Precio</label>
            <InputNumber id="precioUnitario" mode="currency" currency="USD" locale="en-US" />
          </div>
        </div>
        <div className="p-dialog-footer">
          <Button label="Cancelar" className="p-button-danger" onClick={() => setAgregarVisible(false)} />
          <Button label="Guardar" className="p-button-success" onClick={handleAddGasto} />
        </div>
      </Dialog>

      <Dialog header="Editar Gasto" visible={editDialogVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={() => setEditDialogVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="descripcion">Descripción</label>
            <InputText id="descripcion" />
          </div>
          <div className="p-field">
            <label htmlFor="tipoGasto">Tipo de Gasto</label>
            <Dropdown options={TipoGastos} optionLabel="name" placeholder="Seleccionar Tipo de Gasto" className="w-full md:w-14rem" />
          </div>
          <div className="p-field">
            <label htmlFor="cantidad">Cantidad</label>
            <InputNumber id="cantidad" />
          </div>
          <div className="p-field">
            <label htmlFor="precioUnitario">Precio</label>
            <InputNumber id="precioUnitario" mode="currency" currency="USD" locale="en-US" />
          </div>
          <div className="p-field">
            <label htmlFor="precioTotal">Precio Total</label>
            <InputNumber id="precioTotal" mode="currency" currency="USD" disabled />
          </div>
        </div>
        <div className="p-dialog-footer">
          <Button label="Cancelar" className="p-button-danger" onClick={() => setEditDialogVisible(false)} />
          <Button label="Guardar" className="p-button-success" onClick={saveEditedGastoDetail} />
        </div>
      </Dialog>
    </>
  );
}

export default PagTrab;
