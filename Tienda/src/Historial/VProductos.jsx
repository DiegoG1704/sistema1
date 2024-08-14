import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';

export default function VProductos() {
  const [products, setProducts] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [tiposPago, setTiposPago] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para el producto seleccionado
  const [filteredVentas, setFilteredVentas] = useState([]); // Estado para el historial de ventas filtrado
  const [first, setFirst] = useState(0); // Index of the first item in the current page
  const [rows, setRows] = useState(6);   // Number of items per page
  const [histVisible, setHistVisible] = useState(false);
  const [HVentas, setHVentas] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchVentas();
    fetchClientes();
    fetchTipoPagos();
    fetchHVentas();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      const filtered = ventas.filter(venta => venta.ProductoId === selectedProduct.Id);
      setFilteredVentas(filtered);
    }
  }, [selectedProduct, ventas]);

  const fetchVentas = async () => {
    try {
      const response = await axios.get('http://localhost:8081/VentaProductos');
      // Sort the ventas array in descending order by the 'FechVenta' field
      const sortedVentas = response.data.sort((a, b) => new Date(b.FechVenta) - new Date(a.FechVenta));
      setVentas(sortedVentas);
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8081/productos');
      setProducts(response.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const fetchHVentas = async () => {
    try {
      const response = await axios.get('http://localhost:8081/ventas');
      setHVentas(response.data);
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
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

  const fetchTipoPagos = async () => {
    try {
      const response = await axios.get('http://localhost:8081/TipoPagos');
      setTiposPago(response.data);
    } catch (error) {
      console.error('Error al obtener tipos de pago:', error);
    }
  };

  const getFechaVentasById = (ventaId) => {
    const HVenta = HVentas.find(p => p.Id === ventaId);
    return HVenta ? new Date(HVenta.Fecha).toLocaleDateString() : 'Desconocido';
  };

  const getProductNameById = (id) => {
    const product = products.find(p => p.Id === id);
    return product ? product.Nombre : 'Desconocido';
  };

  const getProductPriceById = (id) => {
    const product = products.find(p => p.Id === id);
    return product ? product.PrecioVenta : '0';
  };

  const getClienteNameById = (clienteId) => {
    const cliente = clientes.find(c => c.Id === clienteId);
    return cliente ? `${cliente.Nombre} ${cliente.Apellido}` : 'Desconocido';
  };

  const getTiposPagoNameById = (tipoPagoId) => {
    const tipoPago = tiposPago.find(tp => tp.Id === tipoPagoId);
    return tipoPago ? tipoPago.Nombre : 'Desconocido';
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const HistorialButton = (rowData) => {
    return (
      <Button
        icon="pi pi-send"
        label="Historial"
        className="p-button-rounded p-button-primary p-button-text"
        onClick={() => {
          setSelectedProduct(rowData);
          setHistVisible(true);
        }}
      />
    );
  };

  return (
    <>
      <div className="card">
        <DataTable
          value={products}
          paginator
          rows={rows}
          first={first}
          onPage={onPageChange}
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} elementos"
          tableStyle={{ minWidth: '50rem' }}
        >
          <Column field="Nombre" header="Nombre"/>
          <Column field="PrecioVenta" header="Precio" />
          <Column header="Historial" body={HistorialButton}/>
          <Column field="TipoPagoId" header="Tipo de Pago" body={<ProgressBar value={50}></ProgressBar>} />
        </DataTable>
      </div>
      <Dialog header="Historial de Ventas" visible={histVisible} style={{ width: '70vw' }} onHide={() => setHistVisible(false)}>
        <DataTable
          value={filteredVentas}
          paginator
          rows={rows}
          first={first}
          onPage={onPageChange}
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} elementos"
          tableStyle={{ minWidth: '50rem' }}
        >
          <Column field="ProductoId" header="Producto" body={(rowData) => getProductNameById(rowData.ProductoId)} />
          <Column field="ClienteId" header="Cliente" body={(rowData) => getClienteNameById(rowData.ClienteId)} />
          <Column field="TipoPagoId" header="Tipo de Pago" body={(rowData) => getTiposPagoNameById(rowData.VentaId)} />
          <Column field="Cantidad" header="Cantidad" />
          <Column field="Fecha" header="Fecha" body={(rowData) => getFechaVentasById(rowData.VentaId)} />
        </DataTable>
      </Dialog>
    </>
  );
}
