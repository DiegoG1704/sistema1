import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import '../css/principal.css';
import { Dropdown } from 'primereact/dropdown';

export default function Principal() {
  const [products, setProducts] = useState([]);
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [VentaVisible, setVentaVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    Nombre: '',
    Precio: 0,
    FechaProduccion: null,
    Stock: 0
  });

  useEffect(() => {
    // Simulación de carga de datos inicial
    const productData = [
      { Nombre: 'Producto 1', Precio: 100, FechaProduccion: '2023-06-25', Stock: 50 },
      { Nombre: 'Producto 2', Precio: 150, FechaProduccion: '2023-06-20', Stock: 30 },
      { Nombre: 'Producto 3', Precio: 200, FechaProduccion: '2023-06-15', Stock: 20 },
      { Nombre: 'Producto 4', Precio: 250, FechaProduccion: '2023-06-10', Stock: 10 },
      { Nombre: 'Producto 5', Precio: 300, FechaProduccion: '2023-06-05', Stock: 5 }
    ];
    setProducts(productData);
  }, []);

  const openAddProductDialog = () => {
    setNewProduct({
      Nombre: '',
      Precio: 0,
      FechaProduccion: null,
      Stock: 0
    });
    setAddDialogVisible(true);
  };

  const openEditProductDialog = (product) => {
    setCurrentProduct(product);
    setNewProduct({ ...product });
    setEditDialogVisible(true);
  };

  const saveProduct = () => {
    if (editDialogVisible) {
      setProducts(products.map(p => p === currentProduct ? newProduct : p));
      setEditDialogVisible(false);
    } else {
      setProducts([...products, newProduct]);
      setAddDialogVisible(false);
    }
  };

  const EditarButton = (rowData) => {
    return (
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning p-button-text" onClick={() => openEditProductDialog(rowData)} />
    );
  };

  const EliminarButton = (rowData) => {
    return (
      <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => setProducts(products.filter(p => p !== rowData))} />
    );
  };

  const VentaButton = (rowData) => {
    return (
      <Button icon="pi pi-send" label='vender' className="p-button-rounded p-button-Primary p-button-text" onClick={() => setVentaVisible(true)} />
    );
  };

  const [Ventas,setVentas]=useState(null)
  const venta =[
    {name:'Vender Lote', code:'VL'},
    {name:'Verder por paquetes', code:'VP'},
  ]
  
  const [value2, setValue2] = useState(null);

  return (
    <>
      <h1>Lista de Productos Terminados</h1>
      <div className="flex-container" style={{ marginBottom: '20px' }}>
        <span>Aquí se visualizarán los productos que se terminaron de realizar</span>
        <Button label="Agregar" icon="pi pi-plus" className="p-button-raised p-button-success" onClick={openAddProductDialog} />
      </div>
      <div className="card">
        <DataTable value={products} responsiveLayout="scroll" tableStyle={{ minWidth: '50rem' }}>
          <Column field="Lote" header="Nº Lote"></Column>
          <Column field="Nombre" header="Nombre Producto"></Column>
          <Column field="Precio" header="Precio"></Column>
          <Column field="FechaProduccion" header="Fecha de producción"></Column>
          <Column field="Stock" header="Stock"></Column>
          <Column field="Enpaquetado" header="Enpaquetado"></Column>
          <Column body={VentaButton} header="Venta"></Column>
          <Column header="Editar" body={EditarButton}></Column>
          <Column header="Eliminar" body={EliminarButton}></Column>
        </DataTable>
      </div>

      {/* Add Product Dialog */}
      <Dialog header="Agregar Producto" visible={addDialogVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={() => setAddDialogVisible(false)}>
        <div className="p-fluid flex" style={{ width: '100%' }}>
          <div className="p-field">
            <label htmlFor="nombre">Nombre</label>
            <InputText id="nombre" value={newProduct.Nombre} onChange={(e) => setNewProduct({ ...newProduct, Nombre: e.target.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="precio">Precio</label>
            <InputNumber id="precio" value={newProduct.Precio} onChange={(e) => setNewProduct({ ...newProduct, Precio: e.value })} mode="currency" currency="USD" locale="en-US" />
          </div>
          <div className="p-field">
            <label htmlFor="fecha">Fecha de Producción</label>
            <Calendar id="fecha" value={newProduct.FechaProduccion} onChange={(e) => setNewProduct({ ...newProduct, FechaProduccion: e.value })} dateFormat="yy-mm-dd" />
          </div>
          <div className="p-field">
            <label htmlFor="stock">Stock</label>
            <InputNumber id="stock" value={newProduct.Stock} onChange={(e) => setNewProduct({ ...newProduct, Stock: e.value })} mode="decimal" />
          </div>
        </div>

        <div className="p-dialog-footer" style={{ margin: '5px' }}>
          <Button label="Cancelar" className="p-button-danger" onClick={() => setAddDialogVisible(false)} />
          <Button label="Agregar" className="p-button-success" onClick={saveProduct} />
        </div>
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
            <InputNumber id="precio" value={newProduct.Precio} onChange={(e) => setNewProduct({ ...newProduct, Precio: e.value })} mode="currency" currency="USD" locale="en-US" />
          </div>
          <div className="p-field">
            <label htmlFor="fecha">Fecha de Producción</label>
            <Calendar id="fecha" value={newProduct.FechaProduccion} onChange={(e) => setNewProduct({ ...newProduct, FechaProduccion: e.value })} dateFormat="yy-mm-dd" />
          </div>
          <div className="p-field">
            <label htmlFor="stock">Stock</label>
            <InputNumber id="stock" value={newProduct.Stock} onChange={(e) => setNewProduct({ ...newProduct, Stock: e.value })} mode="decimal" />
          </div>
        </div>

        <div className="p-dialog-footer" style={{ margin: '5px' }}>
          <Button label="Cancelar" className="p-button-danger" onClick={() => setEditDialogVisible(false)} />
          <Button label="Guardar" className="p-button-success" onClick={saveProduct} />
        </div>
      </Dialog>

      <Dialog header="Venta" visible={VentaVisible} style={{ width: '50vw', maxWidth: '90vw' }} onHide={() => setVentaVisible(false)}>
        <div className='p-fluid'>
          <span>Tipo de venta</span>
          <Dropdown  placeholder='seleccione tipo de venta ...' optionLabel='name' options={venta} value={Ventas} onChange={(e) => setVentas(e.value)}/>
          <span>Cantidad</span>
          <InputNumber inputId="withoutgrouping" value={value2} onValueChange={(e) => setValue2(e.value)} useGrouping={false} />
        </div>
        <div className='flex-container'>
          <Button label='Vender' className="p-button-raised p-button-success" />
        </div>
      </Dialog>
    </>
  );
}
