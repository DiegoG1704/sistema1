import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

function PagVenta() {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [tiposComprobante, setTiposComprobante] = useState([]);
  const [tiposPago, setTiposPago] = useState([]);
  const [agregarVisible, setAgregarVisible] = useState(false);
  const [newVenta, setNewVenta] = useState({
    ProductoId: '',
    ClienteId: '',
    TipoComprobanteId: '',
    TipoPagoId: '',
    Cantidad: 0,
    Total: 0
  });
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);

  useEffect(() => {
    fetchVenta();
    fetchProductos();
    fetchClientes();
    fetchTiposComprobante();
    fetchTipoPagos();
  }, []);

  const fetchVenta = async () => {
    try {
      const response = await axios.get('http://localhost:8081/ventas');
      setVentas(response.data);
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:8081/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:8081/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const fetchTiposComprobante = async () => {
    try {
      const response = await axios.get('http://localhost:8081/tiposcomprobantes');
      setTiposComprobante(response.data);
    } catch (error) {
      console.error('Error al obtener tipos de comprobante:', error);
    }
  };

  const fetchTipoPagos = async () => {
    try {
      const response = await axios.get('http://localhost:8081/TipoPagos');
      setTiposPago(response.data);
    } catch (error) {
      console.error('Error al obtener tipos de pago:', error);
    }
  };

  const handleAgregarVenta = () => {
    setAgregarVisible(true);
  };

  const handleEditarVenta = (rowData) => {
    setSelectedVenta(rowData);
    setNewVenta(rowData);
    setEditDialogVisible(true);
  };

  const addVenta = async () => {
    try {
      const response = await axios.post('http://localhost:8081/ventas', newVenta);
      setVentas([...ventas, response.data]);
      setAgregarVisible(false);
      setNewVenta({
        ProductoId: '',
        ClienteId: '',
        TipoComprobanteId: '',
        TipoPagoId: '',
        Cantidad: 0,
        Total: 0
      });
    } catch (error) {
      console.error('Error al agregar venta:', error);
    }
  };

  const editVenta = async () => {
    try {
      if (!selectedVenta) {
        console.error('No se ha seleccionado ninguna venta para editar.');
        return;
      }

      const response = await axios.put(`http://localhost:8081/ventas/${selectedVenta.Id}`, newVenta);
      setVentas(ventas.map(v => (v.Id === selectedVenta.Id ? { ...selectedVenta, ...newVenta } : v)));
      setEditDialogVisible(false);
      setSelectedVenta(null);
      setNewVenta({
        ProductoId: '',
        ClienteId: '',
        TipoComprobanteId: '',
        TipoPagoId: '',
        Cantidad: 0,
        Total: 0
      });
    } catch (error) {
      console.error('Error al actualizar venta:', error);
    }
  };

  const deleteVenta = async (ventaId) => {
    try {
      await axios.delete(`http://localhost:8081/ventas/${ventaId}`);
      const updatedVentas = ventas.filter(venta => venta.Id !== ventaId);
      setVentas(updatedVentas);
    } catch (error) {
      console.error('Error al eliminar la venta:', error);
    }
  };

  const EditarButton = (rowData) => (
    <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning p-button-text" onClick={() => handleEditarVenta(rowData)} />
  );

  const EliminarButton = (rowData) => (
    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => deleteVenta(rowData.Id)} />
  );

  const handleInputChange = (e, field) => {
    const value = e.value !== undefined ? e.value : e.target.value;
    setNewVenta(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleCancel = () => {
    setAgregarVisible(false);
    setEditDialogVisible(false);
    setNewVenta({
      ProductoId: '',
      ClienteId: '',
      TipoComprobanteId: '',
      TipoPagoId: '',
      Cantidad: 0,
      Total: 0
    });
    setSelectedVenta(null);
  };

  return (
    <>
      <div>
        <Button label="Agregar Venta" icon="pi pi-plus" className="p-button-raised p-button-success" onClick={handleAgregarVenta} />
      </div>
      <DataTable value={ventas} tableStyle={{ minWidth: '50rem' }}>
        <Column field="ProductoId" header="Producto" body={rowData => productos.find(producto => producto.Id === rowData.ProductoId)?.Nombre}></Column>
        <Column field="ClienteId" header="Cliente" body={rowData => clientes.find(cliente => cliente.Id === rowData.ClienteId)?.Nombre}></Column>
        <Column field="TipoComprobanteId" header="Tipo de Comprobante" body={rowData => tiposComprobante.find(tipo => tipo.Id === rowData.TipoComprobanteId)?.Nombre}></Column>
        <Column field="TipoPagoId" header="Tipo de Pago" body={rowData => tiposPago.find(tipo => tipo.Id === rowData.TipoPagoId)?.Nombre}></Column>
        <Column field="Cantidad" header="Cantidad"></Column>
        <Column field="Total" header="Total"></Column>
        <Column header="Editar" body={EditarButton}></Column>
        <Column header="Eliminar" body={EliminarButton}></Column>
      </DataTable>

      {/* Diálogo para agregar venta */}
      <Dialog header="Agregar Venta" visible={agregarVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={handleCancel}>
        <div className="p-fluid flex" style={{ width: '100%' }}>
          <div className="p-field">
            <label htmlFor="producto">Producto</label>
            <Dropdown id="producto" value={newVenta.ProductoId} options={productos} onChange={(e) => handleInputChange(e, 'ProductoId')} optionLabel="Nombre" optionValue="Id" />
          </div>
          <div className="p-field">
            <label htmlFor="cliente">Cliente</label>
            <Dropdown id="cliente" value={newVenta.ClienteId} options={clientes} onChange={(e) => handleInputChange(e, 'ClienteId')} optionLabel="Nombre" optionValue="Id" />
          </div>
          <div className="p-field">
            <label htmlFor="tipocomprobante">Tipo de Comprobante</label>
            <Dropdown id="tipocomprobante" value={newVenta.TipoComprobanteId} options={tiposComprobante} onChange={(e) => handleInputChange(e, 'TipoComprobanteId')} optionLabel="Nombre" optionValue="Id" />
          </div>
          <div className="p-field">
            <label htmlFor="tipopago">Tipo de Pago</label>
            <Dropdown id="tipopago" value={newVenta.TipoPagoId} options={tiposPago} onChange={(e) => handleInputChange(e, 'TipoPagoId')} optionLabel="Nombre" optionValue="Id" />
          </div>
          <div className="p-field">
            <label htmlFor="cantidad">Cantidad</label>
            <InputNumber id="cantidad" value={newVenta.Cantidad} onChange={(e) => handleInputChange(e, 'Cantidad')} />
          </div>
          <div className="p-field">
            <label htmlFor="total">Total</label>
            <InputNumber id="total" value={newVenta.Total} onChange={(e) => handleInputChange(e, 'Total')} />
          </div>
        </div>
        <div className="dialog-footer">
          <Button label="Cancelar" icon="pi pi-times" onClick={handleCancel} className="p-button-text" />
          <Button label="Guardar" icon="pi pi-check" onClick={addVenta} autoFocus />
        </div>
      </Dialog>

      {/* Diálogo para editar venta */}
      <Dialog header="Editar Venta" visible={editDialogVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={handleCancel}>
        <div className="p-fluid flex" style={{ width: '100%' }}>
          <div className="p-field">
            <label htmlFor="producto">Producto</label>
            <Dropdown id="producto" value={newVenta.ProductoId} options={productos} onChange={(e) => handleInputChange(e, 'ProductoId')} optionLabel="Nombre" optionValue="Id" />
          </div>
          <div className="p-field">
            <label htmlFor="cliente">Cliente</label>
            <Dropdown id="cliente" value={newVenta.ClienteId} options={clientes} onChange={(e) => handleInputChange(e, 'ClienteId')} optionLabel="Nombre" optionValue="Id" />
          </div>
          <div className="p-field">
            <label htmlFor="tipocomprobante">Tipo de Comprobante</label>
            <Dropdown id="tipocomprobante" value={newVenta.TipoComprobanteId} options={tiposComprobante} onChange={(e) => handleInputChange(e, 'TipoComprobanteId')} optionLabel="Nombre" optionValue="Id" />
          </div>
          <div className="p-field">
            <label htmlFor="tipopago">Tipo de Pago</label>
            <Dropdown id="tipopago" value={newVenta.TipoPagoId} options={tiposPago} onChange={(e) => handleInputChange(e, 'TipoPagoId')} optionLabel="Nombre" optionValue="Id" />
          </div>
          <div className="p-field">
            <label htmlFor="cantidad">Cantidad</label>
            <InputNumber id="cantidad" value={newVenta.Cantidad} onChange={(e) => handleInputChange(e, 'Cantidad')} />
          </div>
          <div className="p-field">
            <label htmlFor="total">Total</label>
            <InputNumber id="total" value={newVenta.Total} onChange={(e) => handleInputChange(e, 'Total')} />
          </div>
        </div>
        <div className="dialog-footer">
          <Button label="Cancelar" icon="pi pi-times" onClick={handleCancel} className="p-button-text" />
          <Button label="Guardar" icon="pi pi-check" onClick={editVenta} autoFocus />
        </div>
      </Dialog>
    </>
  );
}

export default PagVenta;
