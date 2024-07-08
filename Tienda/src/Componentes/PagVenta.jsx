import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

function PagVenta() {
  const [GastoD, setGastoD] = useState([
    { id: 1, Producto: 'Material1', Cliente: 'Empresa1', TipoComprobante: 'Factura', TipoPago: 'Efectivo', Cantidad: 10, Total: 150 },
    { id: 2, Producto: 'Material2', Cliente: 'Empresa2', TipoComprobante: 'Boleta', TipoPago: 'Tarjeta', Cantidad: 5, Total: 100 },
    { id: 3, Producto: 'Material3', Cliente: 'Empresa3', TipoComprobante: 'Factura', TipoPago: 'Efectivo', Cantidad: 8, Total: 96 }
  ]);

  const [agregarVisible, setAgregarVisible] = useState(false);
  const [newGasto, setNewGasto] = useState({
    Producto: '',
    Cliente: '',
    TipoComprobante: '',
    TipoPago: '',
    Cantidad: 0,
    Total: 0
  });
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [selectedGasto, setSelectedGasto] = useState(null);

  const [Materiales] = useState([
    { name: 'Material1', code: 'M1' },
    { name: 'Material2', code: 'M2' },
    { name: 'Material3', code: 'M3' },
  ]);

  const [Proveedores] = useState([
    { name: 'Empresa1', code: 'E1' },
    { name: 'Empresa2', code: 'E2' },
    { name: 'Empresa3', code: 'E3' },
  ]);

  const [TiposComprobante] = useState([
    { label: 'Factura', value: 'Factura' },
    { label: 'Boleta', value: 'Boleta' },
    { label: 'Ticket', value: 'Ticket' },
  ]);

  const [TiposPago] = useState([
    { label: 'Efectivo', value: 'Efectivo' },
    { label: 'Tarjeta', value: 'Tarjeta' },
  ]);

  const handleAgregarGasto = () => {
    setAgregarVisible(true);
  };

  const handleEditarGasto = (rowData) => {
    setSelectedGasto(rowData);
    setEditDialogVisible(true);
  };

  const handleSaveGasto = () => {
    // Aquí puedes implementar la lógica para guardar el nuevo gasto o editar el gasto existente
    if (selectedGasto) {
      // Editar gasto
      const updatedGastoD = GastoD.map(gasto => gasto.id === selectedGasto.id ? { ...gasto, ...selectedGasto } : gasto);
      setGastoD(updatedGastoD);
    } else {
      // Agregar nuevo gasto
      const newId = GastoD.length + 1;
      const newGastoWithId = { ...newGasto, id: newId };
      setGastoD([...GastoD, newGastoWithId]);
    }

    setAgregarVisible(false);
    setEditDialogVisible(false);
    setSelectedGasto(null);
    setNewGasto({
      Producto: '',
      Cliente: '',
      TipoComprobante: '',
      TipoPago: '',
      Cantidad: 0,
      Total: 0
    });
  };

  const handleInputChange = (e, field) => {
    setSelectedGasto(prevState => ({
      ...prevState,
      [field]: e.target.value
    }));
  };

  const handleCancel = () => {
    setAgregarVisible(false);
    setEditDialogVisible(false);
    setSelectedGasto(null);
    setNewGasto({
      Producto: '',
      Cliente: '',
      TipoComprobante: '',
      TipoPago: '',
      Cantidad: 0,
      Total: 0
    });
  };

  const EditarGButton = (rowData) => {
    return (
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-button-text" onClick={() => handleEditarGasto(rowData)} />
    );
  };

  const EliminarGButton = () => {
    return (
      <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" />
    );
  };

  return (
    <>
      <div>
        <Button label="Agregar Gasto" icon="pi pi-plus" className="p-button-raised p-button-success" onClick={handleAgregarGasto} />
      </div>
      <DataTable value={GastoD} tableStyle={{ minWidth: '50rem' }}>
        <Column field="Producto" header="Producto"></Column>
        <Column field="Cliente" header="Cliente"></Column>
        <Column field="TipoComprobante" header="Tipo de Comprobante"></Column>
        <Column field="TipoPago" header="Tipo de Pago"></Column>
        <Column field="Cantidad" header="Cantidad"></Column>
        <Column field="Total" header="Total"></Column>
        <Column header="Editar" body={EditarGButton}></Column>
        <Column header="Eliminar" body={EliminarGButton}></Column>
      </DataTable>

      {/* Diálogo para agregar gasto */}
      <Dialog header="Agregar Gasto" visible={agregarVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={handleCancel}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="Producto">Producto</label>
            <Dropdown value={newGasto.Producto} options={Materiales} onChange={(e) => setNewGasto({ ...newGasto, Producto: e.value })} placeholder="Seleccionar Producto" optionLabel="name" />
          </div>
          <div className="p-field">
            <label htmlFor="Cliente">Cliente</label>
            <Dropdown value={newGasto.Cliente} options={Proveedores} onChange={(e) => setNewGasto({ ...newGasto, Cliente: e.value })} placeholder="Seleccionar Cliente" optionLabel="name" />
          </div>
          <div className="p-field">
            <label htmlFor="TipoComprobante">Tipo de Comprobante</label>
            <Dropdown value={newGasto.TipoComprobante} options={TiposComprobante} onChange={(e) => setNewGasto({ ...newGasto, TipoComprobante: e.value })} placeholder="Seleccionar Tipo de Comprobante" />
          </div>
          <div className="p-field">
            <label htmlFor="TipoPago">Tipo de Pago</label>
            <Dropdown value={newGasto.TipoPago} options={TiposPago} onChange={(e) => setNewGasto({ ...newGasto, TipoPago: e.value })} placeholder="Seleccionar Tipo de Pago" />
          </div>
          <div className="p-field">
            <label htmlFor="Cantidad">Cantidad</label>
            <InputNumber id="Cantidad" value={newGasto.Cantidad} onValueChange={(e) => setNewGasto({ ...newGasto, Cantidad: e.target.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="Total">Total</label>
            <InputNumber id="Total" value={newGasto.Total} onValueChange={(e) => setNewGasto({ ...newGasto, Total: e.target.value })} />
          </div>
        </div>
        <div className="p-dialog-footer">
          <Button label="Cancelar" className="p-button-danger" onClick={handleCancel} />
          <Button label="Guardar" className="p-button-success" onClick={handleSaveGasto} />
        </div>
      </Dialog>

      {/* Diálogo para editar gasto */}
      <Dialog header="Editar Gasto" visible={editDialogVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={handleCancel}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="Producto">Producto</label>
            <Dropdown value={selectedGasto?.Producto} options={Materiales} onChange={(e) => handleInputChange(e, 'Producto')} placeholder="Seleccionar Producto" optionLabel="name" />
          </div>
          <div className="p-field">
            <label htmlFor="Cliente">Cliente</label>
            <Dropdown value={selectedGasto?.Cliente} options={Proveedores} onChange={(e) => handleInputChange(e, 'Cliente')} placeholder="Seleccionar Cliente" optionLabel="name" />
          </div>
          <div className="p-field">
            <label htmlFor="TipoComprobante">Tipo de Comprobante</label>
            <Dropdown value={selectedGasto?.TipoComprobante} options={TiposComprobante} onChange={(e) => handleInputChange(e, 'TipoComprobante')} placeholder="Seleccionar Tipo de Comprobante" />
          </div>
          <div className="p-field">
            <label htmlFor="TipoPago">Tipo de Pago</label>
            <Dropdown value={selectedGasto?.TipoPago} options={TiposPago} onChange={(e) => handleInputChange(e, 'TipoPago')} placeholder="Seleccionar Tipo de Pago" />
          </div>
          <div className="p-field">
            <label htmlFor="Cantidad">Cantidad</label>
            <InputNumber id="Cantidad" value={selectedGasto?.Cantidad} onValueChange={(e) => handleInputChange(e, 'Cantidad')} />
          </div>
          <div className="p-field">
            <label htmlFor="Total">Total</label>
            <InputNumber id="Total" value={selectedGasto?.Total} onValueChange={(e) => handleInputChange(e, 'Total')} />
          </div>
        </div>
        <div className="p-dialog-footer">
          <Button label="Cancelar" className="p-button-danger" onClick={handleCancel} />
          <Button label="Guardar" className="p-button-success" onClick={handleSaveGasto} />
        </div>
      </Dialog>
    </>
  );
}

export default PagVenta;
