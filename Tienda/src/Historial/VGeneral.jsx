import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';

export default function VGeneral() {
  const [products, setProducts] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [tiposPago, setTiposPago] = useState([]);
  const [HVentas, setHVentas] = useState([]);
  const [first, setFirst] = useState(0); // Index of the first item in the current page
  const [rows, setRows] = useState(6);   // Number of items per page

  useEffect(() => {
    fetchProducts();
    fetchVentas();
    fetchClientes();
    fetchTipoPagos();
    fetchHVentas();
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
    return HVenta ? HVenta.Fecha : 'Desconocido';
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

  const getClienteByVentaId = (ventaId) => {
    const HVenta = HVentas.find(p => p.Id === ventaId);
    return HVenta ? getClienteNameById(HVenta.ClienteId) : 'Desconocido';
  };

  const getTiposPagoById = (ventaId) => {
    const HVenta = HVentas.find(p => p.Id === ventaId);
    return HVenta ? getTiposPagoNameById(HVenta.TipoPagoId) : 'Desconocido';
  };

  const getTiposPagoNameById = (tipoPagoId) => {
    const tipoPago = tiposPago.find(tp => tp.Id === tipoPagoId);
    return tipoPago ? tipoPago.Nombre : 'Desconocido';
  };

  // Handle pagination changes
  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  return (
    <>
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
          <Column field="ClienteId" header="Cliente" body={(rowData) => getClienteByVentaId(rowData.VentaId)} />
          <Column field="TipoPagoId" header="Tipo de Pago" body={(rowData) => getTiposPagoById(rowData.VentaId)} />
          <Column field="Cantidad" header="Cantidad" />
          <Column field="Fecha" header="Fecha" body={(rowData) => new Date(getFechaVentasById(rowData.VentaId)).toLocaleDateString()} />
        </DataTable>
      </div>
    </>
  );
}
