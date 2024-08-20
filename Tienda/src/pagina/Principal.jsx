import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { Tag } from 'primereact/tag';

export default function Principal() {
  const [products, setProducts] = useState([]);
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [first, setFirst] = useState(0); // Index of the first item in the current page
  const [rows, setRows] = useState(6);   // Number of items per page
   // Handle pagination changes
   const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };
  const [newProduct, setNewProduct] = useState({
    Nombre: '',
    PrecioVenta: '',
    FechaProduccion: null,
    Stock: 0,
    EmpaquetadoId: null,
    EstadoId: null
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [empaquetados, setEmpaquetados] = useState([]);
  const [estados, setEstados] = useState([]);
  const [ventaVisible, setVentaVisible] = useState(false);
  const [ventas, setVentas] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [tiposComprobante, setTiposComprobante] = useState([]);
  const [tiposPago, setTiposPago] = useState([]);
  const [histVisible, setHistVisible] = useState(false);
  const [DeleteDialog,setDeleteDialog] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchEmpaquetados();
    fetchEstados();
    fetchVentas();
    fetchClientes();
    fetchTipoPagos();
    fetchTiposComprobante();
  }, []);

  const getEmpaquetadoNombreById = (id) => {
    const empaquetado = empaquetados.find(item => item.Id === id);
    return empaquetado ? empaquetado.Nombre : '';
  };

  const getEstadoNombreById = (id) => {
    const estado = estados.find(item => item.Id === id);
    return estado ? estado.Nombre : '';
  };

  const fetchEmpaquetados = async () => {
    try {
      const response = await axios.get('http://localhost:8081/empaquetados');
      setEmpaquetados(response.data);
    } catch (error) {
      console.error('Error fetching empaquetados:', error);
    }
  };

  const fetchEstados = async () => {
    try {
      const response = await axios.get('http://localhost:8081/estados');
      setEstados(response.data);
    } catch (error) {
      console.error('Error fetching estados:', error);
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

  const fetchVentas = async () => {
    try {
      const response = await axios.get('http://localhost:8081/VentaProductos');
      setVentas(response.data);
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

  const getProductState = (stock) => {
    return stock > 0 ? 'Disponible' : 'No Disponible';
  };

  const addProduct = async () => {
  try {
    const formattedProduct = {
      Nombre: newProduct.Nombre,
      PrecioVenta: newProduct.PrecioVenta,
      FechaProduccion: newProduct.FechaProduccion,
      Stock: newProduct.Stock,
      EmpaquetadoId: newProduct.EmpaquetadoId,
      EstadoId: newProduct.EstadoId,
      Estado: getProductState(newProduct.Stock) // Agrega el estado
    };

    const response = await axios.post('http://localhost:8081/productos', formattedProduct);
    setProducts([...products, response.data]);
    setAddDialogVisible(false);
    setNewProduct({
      Nombre: '',
      PrecioVenta: 0,
      FechaProduccion: null,
      Stock: 0,
      EmpaquetadoId: null,
      EstadoId: null
    });
  } catch (error) {
    console.error('Error al agregar producto:', error);
  }
};

const editProduct = async () => {
  try {
    if (!selectedProduct) {
      console.error('No product selected for editing.');
      return;
    }

    const formattedProduct = {
      Nombre: newProduct.Nombre,
      PrecioVenta: newProduct.PrecioVenta,
      FechaProduccion: newProduct.FechaProduccion,
      Stock: newProduct.Stock,
      EmpaquetadoId: newProduct.EmpaquetadoId,
      EstadoId: newProduct.EstadoId,
      Estado: getProductState(newProduct.Stock) // Agrega el estado
    };

    const response = await axios.put(`http://localhost:8081/productos/${selectedProduct.Id}`, formattedProduct);
    setProducts(products.map(p => (p.Id === selectedProduct.Id ? { ...selectedProduct, ...formattedProduct } : p)));
    setEditDialogVisible(false);
    setSelectedProduct(null);
    setNewProduct({
      Nombre: '',
      PrecioVenta: 0,
      FechaProduccion: null,
      Stock: 0,
      EmpaquetadoId: null,
      EstadoId: null
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
  }
};

  const deleteProduct = async (productId) => {
    console.log('Deleting product with ID:', productId); // Debugging line
    if (!productId) {
      console.error('Product ID is not provided.');
      return;
    }
    try {
      await axios.delete(`http://localhost:8081/productos/${productId}`);
      const updatedProducts = products.filter(product => product.Id !== productId);
      setProducts(updatedProducts);
      alert("Producto eliminado correctamente");
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert("Error al eliminar el producto");
    }
  };
  
  useEffect(() => {
    console.log('Products:', products); // Debugging line
  }, [products]);
  
  const EditarButton = (rowData) => {
    return (
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-warning p-button-text"
        onClick={() => {
          setNewProduct({ ...rowData });
          setSelectedProduct(rowData);
          setEditDialogVisible(true);
        }}
      />
    );
  };

  const EliminarButton = (rowData) => {
    return (
      <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => deleteProduct(rowData.Id)} />
    );
  };

  const statusBodyTemplate = (product) => {
    return <Tag style={{textAlign:'center'}} value={getProductState(product.Stock)} severity={getSeverity(product)}></Tag>;
  };
  
  const getSeverity = (product) => {
    switch (getProductState(product.Stock)) {
      case 'Disponible':
        return 'success';
      case 'No Disponible':
        return 'danger';
      default:
        return null;
    }
  };
  


  return (
    <>
      <h1>Lista de Productos Terminados</h1>
      <div className="flex-container" style={{ marginBottom: '20px' }}>
        <span>Aquí se visualizarán los productos que se terminaron de realizar</span>
        <Button label="Agregar" icon="pi pi-plus" className="p-button-raised p-button-success" onClick={() => setAddDialogVisible(true)} />
      </div>
      <div className="card">
        <DataTable value={products} tableStyle={{ minWidth: '50rem' }}>
          <Column field="Nombre" header="Nombre Producto"></Column>
          <Column field="PrecioVenta" header="Precio"></Column>
          <Column field="FechaProduccion" header="Fecha de producción" body={(rowData) => new Date(rowData.FechaProduccion).toLocaleDateString()}></Column>
          <Column field="Stock" header="Stock"></Column>
          <Column field="EmpaquetadoId" header="Empaquetado" body={(rowData) => getEmpaquetadoNombreById(rowData.EmpaquetadoId)}></Column>
          <Column header="Editar" body={EditarButton}></Column>
          <Column header="Eliminar" body={EliminarButton}></Column>
          <Column header="Status" body={statusBodyTemplate}></Column>
        </DataTable>
      </div>

      <Dialog header="Agregar Producto" visible={addDialogVisible} style={{ width: '50vw' }} onHide={() => setAddDialogVisible(false)}>
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="Nombre">Nombre</label>
            <InputText id="Nombre" value={newProduct.Nombre} onChange={(e) => setNewProduct({ ...newProduct, Nombre: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="PrecioVenta">Precio</label>
            <InputNumber id="PrecioVenta" value={newProduct.PrecioVenta} onValueChange={(e) => setNewProduct({ ...newProduct, PrecioVenta: e.value })} mode="currency" currency="USD" locale="en-US" />
          </div>
          <div className="field">
            <label htmlFor="FechaProduccion">Fecha de Producción</label>
            <Calendar id="FechaProduccion" value={newProduct.FechaProduccion} onChange={(e) => setNewProduct({ ...newProduct, FechaProduccion: e.value })} showIcon />
          </div>
          <div className="field">
            <label htmlFor="Stock">Stock</label>
            <InputNumber id="Stock" value={newProduct.Stock} onValueChange={(e) => setNewProduct({ ...newProduct, Stock: e.value })} />
          </div>
          <div className="field">
            <label htmlFor="EmpaquetadoId">Empaquetado</label>
            <Dropdown id="EmpaquetadoId" value={newProduct.EmpaquetadoId} options={empaquetados.map(item => ({ label: item.Nombre, value: item.Id }))} onChange={(e) => setNewProduct({ ...newProduct, EmpaquetadoId: e.value })} placeholder="Seleccione un empaquetado" />
          </div>
          <Button label="Guardar" icon="pi pi-check" className="p-button-raised p-button-success" onClick={addProduct} />
        </div>
      </Dialog>

      <Dialog header="Editar Producto" visible={editDialogVisible} style={{ width: '50vw' }} onHide={() => setEditDialogVisible(false)}>
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="Nombre">Nombre</label>
            <InputText id="Nombre" value={newProduct.Nombre} onChange={(e) => setNewProduct({ ...newProduct, Nombre: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="PrecioVenta">Precio</label>
            <InputNumber id="PrecioVenta" value={newProduct.PrecioVenta} onValueChange={(e) => setNewProduct({ ...newProduct, PrecioVenta: e.value })} mode="currency" currency="USD" locale="en-US" />
          </div>
          <div className="field">
            <label htmlFor="FechaProduccion">Fecha de Producción</label>
            <Calendar id="FechaProduccion" value={newProduct.FechaProduccion} onChange={(e) => setNewProduct({ ...newProduct, FechaProduccion: e.value })} showIcon />
          </div>
          <div className="field">
            <label htmlFor="Stock">Stock</label>
            <InputNumber id="Stock" value={newProduct.Stock} onValueChange={(e) => setNewProduct({ ...newProduct, Stock: e.value })} />
          </div>
          <div className="field">
            <label htmlFor="EmpaquetadoId">Empaquetado</label>
            <Dropdown id="EmpaquetadoId" value={newProduct.EmpaquetadoId} options={empaquetados.map(item => ({ label: item.Nombre, value: item.Id }))} onChange={(e) => setNewProduct({ ...newProduct, EmpaquetadoId: e.value })} placeholder="Seleccione un empaquetado" />
          </div>
          <Button label="Guardar" icon="pi pi-check" className="p-button-raised p-button-success" onClick={editProduct} />
        </div>
      </Dialog>
    </>
  );
}
