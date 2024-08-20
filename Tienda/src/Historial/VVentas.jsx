import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function VVentas() {
  const [products, setProducts] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [tiposPago, setTiposPago] = useState([]);
  const [HVentas, setHVentas] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]); // Estado para almacenar ventas filtradas
  const [first, setFirst] = useState(0); // Index of the first item in the current page
  const [rows, setRows] = useState(6);   // Number of items per page
  const [histVisible, setHistVisible] = useState(false);

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

  const handleHistorialClick = (ventaId) => {
    // Filtra las ventas con el mismo Id de la venta seleccionada
    const filtered = ventas.filter((venta) => venta.VentaId === ventaId);
    setFilteredVentas(filtered);
    setHistVisible(true);
  };

  const HistorialButton = (rowData) => {
    return (
      <Button
        icon="pi pi-send"
        label="Historial"
        className="p-button-rounded p-button-primary p-button-text"
        onClick={() => handleHistorialClick(rowData.Id)}
      />
    );
  };

  const exportVenta = (ventaId) => {
    const venta = ventas.filter(v => v.VentaId === ventaId);
    const ventaDetalle = HVentas.find(hv => hv.Id === ventaId);
    const doc = new jsPDF();
  
    // Agregar el título
    doc.text("Detalle de la Venta", 20, 20);
  
    // Agregar información de la venta
    doc.text(`Fecha: ${new Date(ventaDetalle.Fecha).toLocaleDateString()}`, 20, 30);
    doc.text(`Cliente: ${getClienteNameById(ventaDetalle.ClienteId)}`, 20, 40);
    doc.text(`Tipo de Pago: ${getTiposPagoNameById(ventaDetalle.TipoPagoId)}`, 20, 50);
    doc.text(`Total: S/. ${ventaDetalle.Total}`, 20, 60);
    doc.text("Productos Comprados", 20, 70);
  
    // Preparar los datos para la tabla
    const tableColumn = ["Producto", "Precio", "Cantidad", "Subtotal"];
    const tableRows = [];
  
    venta.forEach(item => {
      const producto = getProductNameById(item.ProductoId);
      const precio = parseFloat(getProductPriceById(item.ProductoId)).toFixed(2);
      const cantidad = item.Cantidad;
      const subtotal = (cantidad * precio).toFixed(2);
      const ventaData = [producto, precio, cantidad, subtotal];
      tableRows.push(ventaData);
    });
  
    // Agregar la tabla al PDF usando autoTable
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 80, // Ajustar la posición de inicio para la tabla
    });
  
    // Guardar el PDF
    doc.save(`venta_${ventaId}.pdf`);
  };  

  const ExportarButton = (rowData) => {
    return (
      <Button
        icon="pi pi-file-export"
        className="p-button-rounded p-button-danger p-button-text"
        onClick={() => exportVenta(rowData.Id)} // Llama a la función exportVenta con el ID de la venta
      />
    );
  };

  return (
    <>
      <div className="card">
        <DataTable
          value={HVentas}
          paginator
          rows={rows}
          first={first}
          onPage={onPageChange}
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} elementos"
          tableStyle={{ minWidth: '50rem' }}
        >
          <Column field="Fecha" header="Fecha" body={(rowData) => new Date(rowData.Fecha).toLocaleDateString()}/>
          <Column field="ClienteId" header="Cliente" body={(rowData) => getClienteNameById(rowData.ClienteId)}/>
          <Column field="TipoPagoId" header="Tipo de Pago" body={(rowData) => getTiposPagoNameById(rowData.TipoPagoId)}/>
          <Column field="Total" header="Total" />
          <Column header="Ventas" body={HistorialButton}/>
          <Column header='Exportar' body={ExportarButton}/>
        </DataTable>
      </div>
      <Dialog header="Ventas" visible={histVisible} style={{ width: '70vw' }} onHide={() => setHistVisible(false)}>
        <DataTable
            value={filteredVentas} // Mostrar ventas filtradas
            paginator
            rows={rows}
            first={first}
            onPage={onPageChange}
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} elementos"
            tableStyle={{ minWidth: '50rem' }}
            >
            <Column field="ProductoId" header="Producto" body={(rowData) => getProductNameById(rowData.ProductoId)} />
            <Column field="Precio" header="Precio" body={(rowData) => getProductPriceById(rowData.ProductoId)} />
            <Column field="Cantidad" header="Cantidad" />
            <Column header="Subtotal" body={(rowData) => (rowData.Cantidad * getProductPriceById(rowData.ProductoId)).toFixed(2)} />
        </DataTable>
      </Dialog>
    </>
  );
}
