import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';

export default function Tecnologia() {
  const [products, setProducts] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [tiposComprobante, setTiposComprobante] = useState([]);
  const [tiposPago, setTiposPago] = useState([]);
  const [first, setFirst] = useState(0); // Index of the first item in the current page
  const [rows, setRows] = useState(6);   // Number of items per page

  useEffect(() => {
    fetchProducts();
    fetchVentas();
    fetchClientes();
    fetchTipoPagos();
    fetchTiposComprobante();
  }, []);

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

  const getProductNameById = (id) => {
    const product = products.find(p => p.Id === id);
    return product ? product.Nombre : 'Desconocido';
  };
  
  const getProductPriceById = (id) => {
    const product = products.find(p => p.Id === id);
    return product ? product.PrecioVenta : '0';
  };

  const getClienteNameById = (id) => {
    const Clientes = clientes.find(p => p.Id === id);
    return Clientes ? Clientes.Nombre : 'Desconocido';
  };

  const getTiposCompNameById = (id) => {
    const tiposComprobante = tiposComprobante.find(p => p.Id === id);
    return tiposComprobante ? tiposComprobante.Nombre : 'Desconocido';
  };

  const getTiposPagoNameById = (id) => {
    const tiposPago = tiposPago.find(p => p.Id === id);
    return tiposPago ? tiposPago.Nombre : 'Desconocido';
  };

  // Handle pagination changes
  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  return (
    <>
      <h1>Historial de ventas</h1>
      <div className="flex-container" style={{ marginBottom: '20px' }}>
        <span>Aquí se visualizarán la lista de los Materiales necesarios</span>
      </div>
      <div className="card">
        <DataTable
          value={ventas}
          paginator
          rows={rows}
          first={first}
          onPage={onPageChange}
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} elementos"
          tableStyle={{ minWidth: '50rem' }}
        >
          <Column field="ProductoId" header="Producto" body={(rowData) => getProductNameById(rowData.ProductoId)} />
          <Column field="Precio" header="Precio" body={(rowData) => getProductPriceById(rowData.ProductoId)} />
          <Column field="ClienteId" header="Cliente" body={(rowData) => getClienteNameById(rowData.ProductoId)} />
          {/* <Column field="TipoComprobanteId" header="Tipo de Comprobante" body={(rowData) => getTiposCompNameById(rowData.ProductoId)} /> 
          <Column field="TipoPagoId" header="Tipo de Pago" body={(rowData) =>  getTiposPagoNameById(rowData.ProductoId)} />*/}
          <Column field="Cantidad" header="Cantidad" />
          <Column field="Total" header="Total Pagado"/>
          <Column field="Fecha" header="Fecha" body={(rowData) => new Date(rowData.FechVenta).toLocaleDateString()} />
        </DataTable>
      </div>
    </>
  );
}
