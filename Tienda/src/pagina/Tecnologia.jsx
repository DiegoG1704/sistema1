import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';

export default function Tecnologia() {
  const [products, setProducts] = useState([]);
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    Nombre: '',
    UnidadMedida: '',
    Proveedor: '',
    Precio: 0,
    Cantidad: 0,
    PrecioPagado: 0,
    FechaCompra: null
  });

  useEffect(() => {
    // Simulación de carga de datos inicial
    const productData = [
      { Nombre: 'Material 1', UnidadMedida: 'kg', Proveedor: 'Proveedor 1', Precio: 100, Cantidad: 50, PrecioPagado: 5000, FechaCompra: '2023-06-25' },
      { Nombre: 'Material 2', UnidadMedida: 'ltr', Proveedor: 'Proveedor 2', Precio: 150, Cantidad: 30, PrecioPagado: 4500, FechaCompra: '2023-06-20' },
      { Nombre: 'Material 3', UnidadMedida: 'm', Proveedor: 'Proveedor 3', Precio: 200, Cantidad: 20, PrecioPagado: 4000, FechaCompra: '2023-06-15' },
      { Nombre: 'Material 4', UnidadMedida: 'pcs', Proveedor: 'Proveedor 4', Precio: 250, Cantidad: 10, PrecioPagado: 2500, FechaCompra: '2023-06-10' },
      { Nombre: 'Material 5', UnidadMedida: 'kg', Proveedor: 'Proveedor 5', Precio: 300, Cantidad: 5, PrecioPagado: 1500, FechaCompra: '2023-06-05' }
    ];
    setProducts(productData);
  }, []);

  // Function to calculate Precio Pagado
  const calculatePrecioPagado = () => {
    return newProduct.Cantidad * newProduct.Precio;
  };

  // Handlers for opening dialogs
  const openAddProductDialog = () => {
    setNewProduct({
      Nombre: '',
      UnidadMedida: '',
      Proveedor: '',
      Precio: 0,
      Cantidad: 0,
      PrecioPagado: 0,
      FechaCompra: null
    });
    setAddDialogVisible(true);
  };

  const openEditProductDialog = (product) => {
    setCurrentProduct(product);
    setNewProduct({ ...product });
    setEditDialogVisible(true);
  };

  // Save product function
  const saveProduct = () => {
    if (editDialogVisible) {
      setProducts(products.map(p => p === currentProduct ? newProduct : p));
      setEditDialogVisible(false);
    } else {
      // Calculate PrecioPagado before adding
      const precioPagado = calculatePrecioPagado();
      setProducts([...products, { ...newProduct, PrecioPagado }]);
      setAddDialogVisible(false);
    }
  };

  const EditarButton = (rowData) => {
    return (
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-button-text" onClick={() => openEditProductDialog(rowData)} />
    );
  };

  const EliminarButton = (rowData) => {
    return (
      <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => setProducts(products.filter(p => p !== rowData))} />
    );
  };

  return (
    <>
      <h1>Lista de Materiales</h1>
      <div className="flex-container" style={{ marginBottom: '20px' }}>
        <span>Aquí se visualizarán la lista de los Materiales necesarios</span>
        <Button label="Agregar" icon="pi pi-plus" className="p-button-raised p-button-success" onClick={openAddProductDialog} />
      </div>
      <div className="card">
        <DataTable value={products} responsiveLayout="scroll" tableStyle={{ minWidth: '50rem' }}>
          <Column field="Nombre" header="Nombre"></Column>
          <Column field="Cantidad" header="Cantidad"></Column>
          <Column field="UnidadMedida" header="Unidad de medida"></Column>
          <Column field="Proveedor" header="Proveedor"></Column>
          <Column field="Precio" header="Precio"></Column>
          <Column header="Editar" body={EditarButton}></Column>
          <Column header="Eliminar" body={EliminarButton}></Column>
        </DataTable>
      </div>

      {/* Add Product Dialog */}
      <Dialog header="Agregar Material" visible={addDialogVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={() => setAddDialogVisible(false)}>
        <div className="p-fluid flex" style={{ width: '100%' }}>
          <div className="p-field">
            <label htmlFor="nombre">Nombre</label>
            <InputText id="nombre" value={newProduct.Nombre} onChange={(e) => setNewProduct({ ...newProduct, Nombre: e.target.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="unidadMedida">Unidad de Medida</label>
            <InputText id="unidadMedida" value={newProduct.UnidadMedida} onChange={(e) => setNewProduct({ ...newProduct, UnidadMedida: e.target.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="proveedor">Proveedor</label>
            <InputText id="proveedor" value={newProduct.Proveedor} onChange={(e) => setNewProduct({ ...newProduct, Proveedor: e.target.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="precio">Precio</label>
            <InputNumber id="precio" value={newProduct.Precio} onChange={(e) => setNewProduct({ ...newProduct, Precio: e.value })} mode="currency" currency="USD" locale="en-US" />
          </div>
          <div className="p-field">
            <label htmlFor="cantidad">Cantidad</label>
            <InputNumber id="cantidad" value={newProduct.Cantidad} onChange={(e) => setNewProduct({ ...newProduct, Cantidad: e.value })} />
          </div>
          {/* Precio Pagado field */}
          <div className="p-field">
            <label htmlFor="precioPagado">Precio Pagado</label>
            <InputNumber id="precioPagado" value={calculatePrecioPagado()} disabled />
          </div>
          <div className="p-field">
            <label htmlFor="fechaCompra">Fecha de Compra</label>
            <Calendar id="fechaCompra" value={newProduct.FechaCompra} onChange={(e) => setNewProduct({ ...newProduct, FechaCompra: e.value })} dateFormat="yy-mm-dd" />
          </div>
        </div>

        <div className="p-dialog-footer" style={{ margin: '5px' }}>
          <Button label="Cancelar" className="p-button-danger" onClick={() => setAddDialogVisible(false)} />
          <Button label="Agregar" className="p-button-success"  />
        </div>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog header="Editar Material" visible={editDialogVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={() => setEditDialogVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="nombre">Nombre</label>
            <InputText id="nombre" value={newProduct.Nombre} onChange={(e) => setNewProduct({ ...newProduct, Nombre: e.target.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="unidadMedida">Unidad de Medida</label>
            <InputText id="unidadMedida" value={newProduct.UnidadMedida} onChange={(e) => setNewProduct({ ...newProduct, UnidadMedida: e.target.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="proveedor">Proveedor</label>
            <InputText id="proveedor" value={newProduct.Proveedor} onChange={(e) => setNewProduct({ ...newProduct, Proveedor: e.target.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="precio">Precio</label>
            <InputNumber id="precio" value={newProduct.Precio} onChange={(e) => setNewProduct({ ...newProduct, Precio: e.value })} mode="currency" currency="USD" locale="en-US" />
          </div>
          <div className="p-field">
            <label htmlFor="cantidad">Cantidad</label>
            <InputNumber id="cantidad" value={newProduct.Cantidad} onChange={(e) => setNewProduct({ ...newProduct, Cantidad: e.value })} />
          </div>
          {/* Campo de Precio Pagado (calculado) */}
          <div className="p-field">
            <label htmlFor="precioPagado">Precio Pagado</label>
            <InputNumber id="precioPagado" value={newProduct.Cantidad * newProduct.Precio} disabled />
          </div>
          <div className="p-field">
            <label htmlFor="fechaCompra">Fecha de Compra</label>
            <Calendar id="fechaCompra" value={newProduct.FechaCompra} onChange={(e) => setNewProduct({ ...newProduct, FechaCompra: e.value })} dateFormat="yy-mm-dd" />
          </div>
        </div>

        <div className="p-dialog-footer">
          <Button label="Cancelar" className="p-button-danger" onClick={() => setEditDialogVisible(false)} />
          <Button label="Guardar" className="p-button-success"  />
        </div>
      </Dialog>
    </>
  );
}
