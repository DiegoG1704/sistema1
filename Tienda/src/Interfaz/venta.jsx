import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import axios from 'axios';
import { Toast } from 'primereact/toast';

export default function Venta() {
    const [ventas, setVentas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [tiposComprobante, setTiposComprobante] = useState([]);
    const [tiposPago, setTiposPago] = useState([]);
    const [agregarVisible, setAgregarVisible] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [selectedVenta, setSelectedVenta] = useState(null);
    const [newVenta, setNewVenta] = useState({
      ProductoId: '',
      ClienteId: '',
      TipoComprobanteId: '',
      TipoPagoId: '',
      Cantidad: 0,
      Total: 0
    });
    const [PreVent, setPreVent] = useState('');
    const [Stock, setStock] = useState('');
    const [deleteVisible, setDeleteVisible] = useState(false); // Renombré DeleteVisible a deleteVisible por convención de nombres
    const toast = useRef(null);
  
    useEffect(() => {
      fetchVenta();
      fetchProductos();
      fetchClientes();
      fetchTiposComprobante();
      fetchTipoPagos();
    }, []);
  
    useEffect(() => {
      const selectedProduct = productos.find(producto => producto.Id === newVenta.ProductoId);
      if (selectedProduct) {
        setPreVent(selectedProduct.PrecioVenta);
        setStock(selectedProduct.Stock);
      } else {
        setPreVent('');
        setStock('');
      }
    }, [newVenta.ProductoId, productos]);
  
    useEffect(() => {
      const total = PreVent * newVenta.Cantidad;
      setNewVenta(prevState => ({
        ...prevState,
        Total: total
      }));
    }, [PreVent, newVenta.Cantidad]);
  
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
  
  // En PagVenta.jsx
  
  const addVenta = async () => {
    try {
      // Validar cantidad no mayor al stock disponible
      if (newVenta.Cantidad > Stock) {
        toast.current.show({ severity: 'info', summary: 'Info', detail: 'La cantidad no puede ser mayor que el stock disponible.', life: 3000 });
        return;
      }
  
      // Realizar la venta y luego actualizar el stock
      const total = PreVent * newVenta.Cantidad;
      const ventaToAdd = {
        ...newVenta,
        Total: total
      };
      const response = await axios.post('http://localhost:8081/ventas', ventaToAdd);
  
      // Actualizar el stock en Principal.jsx después de la venta
      props.actualizarStock(newVenta.ProductoId, newVenta.Cantidad);
  
      // Actualizar la lista de ventas y resetear el formulario
      setVentas(prevVentas => [...prevVentas, response.data]);
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
          toast.current.show({ severity: 'info', summary: 'Info', detail: 'La cantidad no puede ser mayor que el stock disponible.', life: 3000 });
          console.error('No se ha seleccionado ninguna venta para editar.');
          return;
        }
    
        // Validar cantidad no mayor al stock disponible
        if (newVenta.Cantidad > Stock) {
          toast.current.show({ severity: 'info', summary: 'Info', detail: 'La cantidad no puede ser mayor que el stock disponible.', life: 3000 });
          return;
        }
    
        const total = PreVent * newVenta.Cantidad;
        const ventaToEdit = {
          ...newVenta,
          Total: total
        };
    
        const response = await axios.put(`http://localhost:8081/ventas/${selectedVenta.Id}`, ventaToEdit);
        setVentas(prevVentas => prevVentas.map(v => (v.Id === selectedVenta.Id ? { ...selectedVenta, ...ventaToEdit } : v)));
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
        setVentas(prevVentas => prevVentas.filter(venta => venta.Id !== ventaId));
        setDeleteVisible(false); // Ocultar el diálogo de eliminación después de eliminar la venta
      } catch (error) {
        console.error('Error al eliminar la venta:', error);
      }
    };
  
    const eliminarButton = (rowData) => (
      <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => {
        setSelectedVenta(rowData);
        setDeleteVisible(true);
      }}>
        <span>Eliminar</span>
      </Button>
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
      setDeleteVisible(false);
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
  
    const editarButton = (rowData) => (
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning p-button-text" onClick={() => handleEditarVenta(rowData)} />
    );
    return(
        <>
        <div className="p-fluid flex" style={{ width: '100%' }}>
          <div className="p-field">
            <label htmlFor="producto">Producto</label>
            <Dropdown id="producto" value={newVenta.ProductoId} options={productos} onChange={(e) => handleInputChange(e, 'ProductoId')} optionLabel="Nombre" optionValue="Id" placeholder="Seleccionar Producto" />
          </div>
          <div className="p-field">
            <label htmlFor="precioVenta">Precio de venta</label>
            <InputText disabled value={PreVent} />
          </div>
          <div className="p-field">
            <label htmlFor="cliente">Cliente</label>
            <Dropdown id="cliente" value={newVenta.ClienteId} options={clientes} onChange={(e) => handleInputChange(e, 'ClienteId')} optionLabel="Nombre" optionValue="Id" placeholder="Seleccionar Cliente" />
          </div>
          <div className="p-field">
            <label htmlFor="tipoComprobante">Tipo de Comprobante</label>
            <Dropdown id="tipoComprobante" value={newVenta.TipoComprobanteId} options={tiposComprobante} onChange={(e) => handleInputChange(e, 'TipoComprobanteId')} optionLabel="Nombre" optionValue="Id" placeholder="Seleccionar Tipo de Comprobante" />
          </div>
          <div className="p-field">
            <label htmlFor="tipoPago">Tipo de Pago</label>
            <Dropdown id="tipoPago" value={newVenta.TipoPagoId} options={tiposPago} onChange={(e) => handleInputChange(e, 'TipoPagoId')} optionLabel="Nombre" optionValue="Id" placeholder="Seleccionar Tipo de Pago" />
          </div>
          <div className="p-field">
            <label htmlFor="cantidad">Cantidad</label>
            <InputNumber id="cantidad" value={newVenta.Cantidad} onValueChange={(e) => handleInputChange(e, 'Cantidad')} mode="decimal" showButtons min={0} />
            <small>El valor maximo es {Stock}</small>
          </div>
          <div className="p-field">
            <label htmlFor="total">Total</label>
            <InputNumber id="total" value={newVenta.Total} mode="currency" currency="USD" disabled />
          </div>
        </div>
        <div className="p-dialog-footer">
          <Button label="Agregar" icon="pi pi-check" onClick={addVenta} />
        </div>
        </>
    )
}