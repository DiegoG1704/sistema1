import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

function PagMat() {
  const [GastoD, setGastoD] = useState([]);
  const [agregarVisible, setAgregarVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [selectedGasto, setSelectedGasto] = useState(null);
  const [newGasto, setNewGasto] = useState({ Nombre: '', Proveedor: '', UnidadM: '', Precio: 0, Cantidad: 0 });

  const Materiales = [
    { name: 'Material1', code: 'M1' },
    { name: 'Material2', code: 'M2' },
    { name: 'Material3', code: 'M3' },
  ];

  const Proveedor = [
    { name: 'Empresa1', code: 'E1' },
    { name: 'Empresa2', code: 'E2' },
    { name: 'Empresa3', code: 'E3' },
  ];

  const Unidades = [
    { name: 'Kg', code: 'KG' },
    { name: 'Saco', code: 'SC' },
    { name: 'Tonelada', code: 'Tonelada' },
  ];

  useEffect(() => {
    fetchGastos();
  }, []);

  const fetchGastos = async () => {
    try {
      const response = await axios.get('http://localhost:8081/pagoMaterial');
      setGastoD(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAgregarGasto = async () => {
    const response = await axios.post('http://localhost:8081/pagoMaterial', newGasto);
    setGastoD([...GastoD, response.data]);
    setAgregarVisible(false);
    setNewGasto({ Nombre: '', Proveedor: '', UnidadM: '', Precio: 0, Cantidad: 0 });
  };

  const handleEliminarGasto = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/pagoMaterial/${id}`);
      setGastoD(GastoD.filter((gasto) => gasto.ID !== id));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleEditarGasto = async () => {
    try {
      const response = await axios.put(`http://localhost:8081/pagoMaterial/${selectedGasto.ID}`, selectedGasto);
      const updatedGastos = GastoD.map((gasto) =>
        gasto.ID === selectedGasto.ID ? response.data : gasto
      );
      setGastoD(updatedGastos);
      setEditDialogVisible(false);
      setSelectedGasto(null);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const calcularPrecioTotal = (rowData) => {
    return rowData.Cantidad * rowData.Precio;
  };

  const EditarGButton = (rowData) => {
    return (
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-button-text" onClick={() => {
        setSelectedGasto({ ...rowData }); // Clonar el objeto para evitar mutaciones inesperadas
        setEditDialogVisible(true);
      }} />
    );
  };

  const EliminarGButton = (rowData) => {
    return (
      <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => handleEliminarGasto(rowData.ID)} />
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
        <Column field="UnidadM" header="Unidad"></Column>
        <Column field="Precio" header="Precio Unitario"></Column>
        <Column header="Precio Total" body={(rowData) => calcularPrecioTotal(rowData)}></Column>
        <Column header="Editar" body={EditarGButton}></Column>
        <Column header="Eliminar" body={EliminarGButton}></Column>
      </DataTable>

      <Dialog header="Agregar Gasto" visible={agregarVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={() => setAgregarVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="tipoGasto">Nombre</label>
            <Dropdown options={Materiales} optionLabel="name" placeholder="Seleccionar Material" className="w-full md:w-14rem" value={newGasto.Nombre} onChange={(e) => setNewGasto({ ...newGasto, Nombre: e.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="descripcion">Proveedor</label>
            <Dropdown options={Proveedor} optionLabel="name" placeholder="Seleccionar Proveedor" className="w-full md:w-14rem" value={newGasto.Proveedor} onChange={(e) => setNewGasto({ ...newGasto, Proveedor: e.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="descripcion">Unidad de Medida</label>
            <Dropdown options={Unidades} optionLabel="name" placeholder="Seleccionar Unidad" className="w-full md:w-14rem" value={newGasto.UnidadM} onChange={(e) => setNewGasto({ ...newGasto, UnidadM: e.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="cantidad">Cantidad</label>
            <InputNumber id="cantidad" value={newGasto.Cantidad} onValueChange={(e) => setNewGasto({ ...newGasto, Cantidad: e.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="precioUnitario">Precio</label>
            <InputNumber id="precioUnitario" value={newGasto.Precio} onValueChange={(e) => setNewGasto({ ...newGasto, Precio: e.value })} mode="currency" currency="USD" locale="en-US" />
          </div>
        </div>
        <div className="p-dialog-footer">
          <Button label="Cancelar" className="p-button-danger" onClick={() => setAgregarVisible(false)} />
          <Button label="Guardar" className="p-button-success" onClick={handleAgregarGasto} />
        </div>
      </Dialog>

      <Dialog header="Editar Gasto" visible={editDialogVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={() => setEditDialogVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="descripcion">Nombre</label>
            <Dropdown options={Materiales} optionLabel="name" placeholder="Seleccionar Material" className="w-full md:w-14rem" value={selectedGasto?.Nombre} onChange={(e) => setSelectedGasto({ ...selectedGasto, Nombre: e.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="tipoGasto">Proveedor</label>
            <Dropdown options={Proveedor} optionLabel="name" placeholder="Seleccionar Proveedor" className="w-full md:w-14rem" value={selectedGasto?.Proveedor} onChange={(e) => setSelectedGasto({ ...selectedGasto, Proveedor: e.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="descripcion">Unidad de Medida</label>
            <Dropdown options={Unidades} optionLabel="name" placeholder="Seleccionar Unidad" className="w-full md:w-14rem" value={selectedGasto?.UnidadM} onChange={(e) => setSelectedGasto({ ...selectedGasto, UnidadM: e.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="cantidad">Cantidad</label>
            <InputNumber id="cantidad" value={selectedGasto?.Cantidad} onValueChange={(e) => setSelectedGasto({ ...selectedGasto, Cantidad: e.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="precioUnitario">Precio</label>
            <InputNumber id="precioUnitario" value={selectedGasto?.Precio} onValueChange={(e) => setSelectedGasto({ ...selectedGasto, Precio: e.value })} mode="currency" currency="USD" locale="en-US" />
          </div>
        </div>
        <div className="p-dialog-footer">
          <Button label="Cancelar" className="p-button-danger" onClick={() => setEditDialogVisible(false)} />
          <Button label="Guardar" className="p-button-success" onClick={handleEditarGasto} />
        </div>
      </Dialog>


    </>
  );
}

export default PagMat;
