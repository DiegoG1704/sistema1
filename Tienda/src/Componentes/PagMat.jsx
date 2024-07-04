import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

function PagMat() {
  const [GastoD, setGastoD] = useState([
    { id: 1, Nombre: 'Material1', Proveedor: 'Empresa1', Cantidad: 10, PrecioUnitario: 15, PrecioTotal: 150 },
    { id: 2, Nombre: 'Material2', Proveedor: 'Empresa2', Cantidad: 5, PrecioUnitario: 20, PrecioTotal: 100 },
    { id: 3, Nombre: 'Material3', Proveedor: 'Empresa3', Cantidad: 8, PrecioUnitario: 12, PrecioTotal: 96 }
  ]);

  const [agregarVisible, setAgregarVisible] = useState(false);
  const [newGasto, setNewGasto] = useState({});
  const [editDialogVisible, setEditDialogVisible] = useState(false);

  const [Material,setMaterial] = useState(null);
  const Materiales = [
    { name: 'Material1', code: 'M1' },
    { name: 'Material2', code: 'M2' },
    { name: 'Material3', code: 'M3' },
  ];

  const [Proveedor,setProveedor] = useState(null);
  const Proveedores = [
    { name: 'Empresa1', code: 'E1' },
    { name: 'Empresa2', code: 'E2' },
    { name: 'Empresa3', code: 'E3' },
  ];

  const [Unidad,setUnidad] = useState(null);
  const UnidadM = [
    { name: 'Unidad1', code: 'U1' },
    { name: 'Unidad2', code: 'U2' },
    { name: 'Unidad3', code: 'U3' },
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

  return (
    <>
      <div>
        <Button label="Agregar Gasto" icon="pi pi-plus" className="p-button-raised p-button-success" onClick={() => setAgregarVisible(true)} />
      </div>
      <DataTable value={GastoD} tableStyle={{ minWidth: '50rem' }}>
        <Column field="Nombre" header="Nombre"></Column>
        <Column field="Proveedor" header="Proveedor"></Column>
        <Column field="Cantidad" header="Cantidad"></Column>
        <Column field="PrecioUnitario" header="Precio Unitario"></Column>
        <Column field="PrecioTotal" header="Precio Total"></Column>
        <Column header="Editar" body={EditarGButton}></Column>
        <Column header="Eliminar" body={EliminarGButton}></Column>
      </DataTable>

      <Dialog header="Agregar Gasto" visible={agregarVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={() => setAgregarVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="Nombre">Nombre</label>
            <Dropdown value={Material} options={Materiales} onChange={(e) => setMaterial(e.value)} placeholder="Seleccionar Material" className="w-full md:w-5rem" optionLabel="name" />
          </div>
          <div className="p-field">
            <label htmlFor="Nombre">Unidad de Medida</label>
            <Dropdown options={UnidadM} onChange={(e) => setUnidad(e.value)} value={Unidad} placeholder="Seleccionar Material" className="w-full md:w-14rem" optionLabel="name" />
          </div>
          <div className="p-field">
            <label htmlFor="Proveedor">Proveedor</label>
            <Dropdown options={Proveedores} onChange={(e) => setProveedor(e.value)} value={Proveedor} optionLabel="name" placeholder="Seleccionar Proveedor" className="w-full md:w-14rem" />
          </div>
          <div className="p-field">
            <label htmlFor="Cantidad">Cantidad</label>
            <InputNumber id="Cantidad" onValueChange={(e) => handleInputChange(e, 'Cantidad')} />
          </div>
          <div className="p-field">
            <label htmlFor="PrecioUnitario">Precio Unitario</label>
            <InputNumber id="PrecioUnitario" mode="currency" currency="USD" locale="en-US" onValueChange={(e) => handleInputChange(e, 'PrecioUnitario')} />
          </div>
        </div>
        <div className="p-dialog-footer">
          <Button label="Cancelar" className="p-button-danger" onClick={() => setAgregarVisible(false)} />
          <Button label="Guardar" className="p-button-success"/>
        </div>
      </Dialog>

      <Dialog header="Editar Gasto" visible={editDialogVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={() => setEditDialogVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="Nombre">Nombre</label>
            <Dropdown options={Materiales} optionLabel="name" placeholder="Seleccionar Material" className="w-full md:w-14rem" />
          </div>
          <div className="p-field">
            <label htmlFor="Proveedor">Proveedor</label>
            <Dropdown options={Proveedores} optionLabel="name" placeholder="Seleccionar Proveedor" className="w-full md:w-14rem" />
          </div>
          <div className="p-field">
            <label htmlFor="Cantidad">Cantidad</label>
            <InputNumber id="Cantidad" />
          </div>
          <div className="p-field">
            <label htmlFor="PrecioUnitario">Precio Unitario</label>
            <InputNumber id="PrecioUnitario" mode="currency" currency="USD" locale="en-US" />
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

export default PagMat;
