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
import PagVenta from '../Componentes/PagVenta';

export default function Principal() {
  const [products, setProducts] = useState([]);
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({
    Nombre: '',
    PrecioVenta: 0,
    FechaProduccion: null,
    Stock: 0,
    EmpaquetadoId: null,
    EstadoId: null
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [empaquetados, setEmpaquetados] = useState([]);
  const [estados, setEstados] = useState([]);
  const [VentaVisible,setVentaVisible]= useState(false);

  useEffect(() => {
    fetchProducts();
    fetchEmpaquetados();
    fetchEstados();
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

  const addProduct = async () => {
    try {
      // Aquí debes definir la lógica para formatear el producto antes de enviarlo al servidor
      const formattedProduct = {
        Nombre: newProduct.Nombre,
        PrecioVenta: newProduct.PrecioVenta,
        FechaProduccion: newProduct.FechaProduccion,
        Stock: newProduct.Stock,
        EmpaquetadoId: newProduct.EmpaquetadoId,
        EstadoId: newProduct.EstadoId
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
  
      // Aquí también debes definir la lógica para formatear el producto antes de enviarlo al servidor
      const formattedProduct = {
        Nombre: newProduct.Nombre,
        PrecioVenta: newProduct.PrecioVenta,
        FechaProduccion: newProduct.FechaProduccion,
        Stock: newProduct.Stock,
        EmpaquetadoId: newProduct.EmpaquetadoId,
        EstadoId: newProduct.EstadoId
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

  const EditarButton = (rowData) => {
    return (
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-warning p-button-text"
        onClick={() => {
          setNewProduct({ ...rowData }); // Set newProduct state to the selected rowData
          setSelectedProduct(rowData); // Set selectedProduct state
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

  const VentaButton = (rowData) => {
    return (
      <Button
        icon="pi pi-send"
        label="Vender"
        className="p-button-rounded p-button-primary p-button-text"
        onClick={() => {
          setNewProduct(rowData); // Actualiza el producto seleccionado
          setVentaVisible(true); // Muestra el diálogo de venta
        }}
      />
    );
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
          <Column field='EstadoId' header="Estado" body={(rowData) => getEstadoNombreById(rowData.EstadoId)}></Column>
          <Column body={VentaButton} header="Vender"></Column>
          <Column header="Editar" body={EditarButton}></Column>
          <Column header="Eliminar" body={EliminarButton}></Column>
        </DataTable>
      </div>

      {/* Add Product Dialog */}
      <Dialog header={`Historial de venta de ${newProduct.Nombre}`} visible={VentaVisible} style={{width:'60vw'}} onHide={() => setVentaVisible(false)}>
        <PagVenta/>
      </Dialog>


      {/* Add Product Dialog */}
      <Dialog header="Agregar Producto" visible={addDialogVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={() => setAddDialogVisible(false)}>
        <div className="p-fluid flex" style={{ width: '100%' }}>
          <div className="p-field">
            <label htmlFor="nombre">Nombre</label>
            <InputText id="nombre" value={newProduct.Nombre} onChange={(e) => setNewProduct({ ...newProduct, Nombre: e.target.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="precio">Precio</label>
            <InputNumber id="precio" value={newProduct.PrecioVenta} onChange={(e) => setNewProduct({ ...newProduct, PrecioVenta: e.value })} mode="currency" currency="USD" locale="en-US" />
          </div>
          <div className="p-field">
            <label htmlFor="fecha">Fecha de Producción</label>
            <Calendar id="fecha" value={newProduct.FechaProduccion} onChange={(e) => setNewProduct({ ...newProduct, FechaProduccion: e.value })} dateFormat="yy-mm-dd" />
          </div>
          <div className="p-field">
            <label htmlFor="stock">Stock</label>
            <InputNumber id="stock" value={newProduct.Stock} onChange={(e) => setNewProduct({ ...newProduct, Stock: e.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="empaquetado">Empaquetado</label>
            <Dropdown id="empaquetado" value={newProduct.EmpaquetadoId} options={empaquetados} onChange={(e) => setNewProduct({ ...newProduct, EmpaquetadoId: e.value })} optionLabel="Nombre" optionValue="Id" />
          </div>
          <div className="p-field">
            <label htmlFor="estado">Estado</label>
            <Dropdown id="estado" value={newProduct.EstadoId} options={estados} onChange={(e) => setNewProduct({ ...newProduct, EstadoId: e.value })} optionLabel="Nombre" optionValue="Id" />
          </div>
        </div>
        <Button label="Agregar" icon="pi pi-check" onClick={addProduct} />
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog header="Editar Producto" visible={editDialogVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={() => setEditDialogVisible(false)}>
        <div className="p-fluid flex" style={{ width: '100%' }}>
          <div className="p-field">
            <label htmlFor="nombre">Nombre</label>
            <InputText id="nombre" value={newProduct.Nombre} onChange={(e) => setNewProduct({ ...newProduct, Nombre: e.target.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="precio">Precio</label>
            <InputNumber id="precio" value={newProduct.PrecioVenta} onChange={(e) => setNewProduct({ ...newProduct, PrecioVenta: e.value })} mode="currency" currency="USD" locale="en-US" />
          </div>
          <div className="p-field">
            <label htmlFor="fecha">Fecha de Producción</label>
            <Calendar id="fecha"  value={newProduct.FechaProduccion ? new Date(newProduct.FechaProduccion) : null} onChange={(e) => setNewProduct({ ...newProduct, FechaProduccion: e.value })} dateFormat="yy-mm-dd" />
          </div>
          <div className="p-field">
            <label htmlFor="stock">Stock</label>
            <InputNumber id="stock" value={newProduct.Stock} onChange={(e) => setNewProduct({ ...newProduct, Stock: e.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="empaquetado">Empaquetado</label>
            <Dropdown id="empaquetado" value={newProduct.EmpaquetadoId} options={empaquetados} onChange={(e) => setNewProduct({ ...newProduct, EmpaquetadoId: e.value })} optionLabel="Nombre" optionValue="Id" />
          </div>
          <div className="p-field">
            <label htmlFor="estado">Estado</label>
            <Dropdown id="estado" value={newProduct.EstadoId} options={estados} onChange={(e) => setNewProduct({ ...newProduct, EstadoId: e.value })} optionLabel="Nombre" optionValue="Id" />
          </div>
        </div>
        <Button label="Guardar" icon="pi pi-check" onClick={editProduct} />
      </Dialog>
    </>
  );
}
