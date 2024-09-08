import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import GenerarPDF from '../PDF/PDFventa';

const AgregarVenta = ({userId}) => {
    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [tiposComprobante, setTiposComprobante] = useState([]);
    const [tiposPago, setTiposPago] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [ventas, setVentas] = useState([]);
    const [clienteId, setClienteId] = useState(null);
    const [tipoComprobanteId, setTipoComprobanteId] = useState(null);
    const [tipoPagoId, setTipoPagoId] = useState(null);
    const [montoRecibido, setMontoRecibido] = useState('');

    const toast = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:8081/productos')
        .then(response => {
            // Filtrar productos con stock mayor a 0
            const productosConStock = response.data.filter(producto => producto.Stock > 0);
            setProductos(productosConStock);
        });
        axios.get(`http://localhost:8081/clientes/${userId}`).then(response => setClientes(response.data));
        axios.get('http://localhost:8081/tiposcomprobantes').then(response => setTiposComprobante(response.data));
        axios.get('http://localhost:8081/TipoPagos').then(response => setTiposPago(response.data));
    }, []);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/usuario/${userId}/productos`);
                const productosConStock = response.data.filter(producto => producto.Stock > 0);
            setProductos(productosConStock); // Asegúrate de que `setProducts` está actualizando el estado correctamente
            } catch (error) {
                console.error('Error fetching productos:', error);
            }
        };
    
        if (userId) {
            fetchProductos();
        }
    }, [userId]);

    const handleAddProduct = () => {
        if (selectedProducto && cantidad > 0) {
            const stock = selectedProducto.Stock;

            if (cantidad > stock) {
                toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La cantidad solicitada excede el stock disponible', life: 3000 });
                return;
            }

            setVentas([...ventas, {
                productoId: selectedProducto.Id,
                nombre: selectedProducto.Nombre,
                cantidad,
                precio: selectedProducto.PrecioVenta
            }]);
            setSelectedProducto(null);
            setCantidad(1);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Seleccione un producto y cantidad válida', life: 3000 });
        }
    };

    const calcularTotal = () => {
        return ventas.reduce((total, item) => total + (item.cantidad * item.precio), 0);
    };

    const handleSubmit = () => {
        if (!clienteId || !tipoComprobanteId || !tipoPagoId) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Seleccione todos los campos necesarios', life: 3000 });
            return;
        }
    
        const total = calcularTotal();
        axios.post('http://localhost:8081/ventas', {
            fecha: new Date().toISOString().slice(0, 10),
            clienteId: clienteId.Id,
            tipoComprobanteId: tipoComprobanteId.Id,
            tipoPagoId: tipoPagoId.Id,
            total,
            montoRecibido,
            productos: ventas.map(p => ({
                productoId: p.productoId,
                cantidad: p.cantidad,
                precio: p.precio
            })),
            UsuarioId: userId
        }).then(response => {
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Venta realizada con éxito', life: 3000 });
            setVentas([]);
            setClienteId(null);
            setTipoComprobanteId(null);
            setTipoPagoId(null);
            setMontoRecibido('');
        }).catch(error => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al realizar la venta', life: 3000 });
            console.error('Error al realizar la venta:', error);
        });
    };
    

    const [MostClie, setMostClie] = useState(false);
    const [cliente, setCliente] = useState({
        DNI: '',
        Nombre: '',
        Apellido: '',
        Telefono: '',
        Correo: '',
        UsuarioId: userId
    });

    const handleInputChangeCliente = (e, field) => {
        const value = e.value !== undefined ? e.value : e.target.value;
        setCliente(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleSubmitCliente = async () => {
        if (!cliente.DNI || !cliente.Nombre || !cliente.Apellido || !cliente.Telefono || !cliente.Correo) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos del cliente son requeridos', life: 3000 });
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:8081/clientes', cliente);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: `Cliente agregado con éxito`, life: 3000 });
    
            setCliente({
                DNI: '',
                Nombre: '',
                Apellido: '',
                Telefono: '',
                Correo: ''
            });
    
            axios.get('http://localhost:8081/clientes').then(response => setClientes(response.data));
    
            setMostClie(false);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al agregar cliente', life: 3000 });
            console.error('Error al agregar cliente:', error);
        }
    };
    
    const [VerPDF, setVerPDF] = useState(false);

    return (
        <div className="p-fluid" style={{ padding: '1rem' }}>
            <Toast ref={toast} />
            <h2>Realizar Venta</h2>
            <div className="p-grid p-formgrid">
                <div className="p-field p-col-12 p-md-4" style={{ marginTop: '5px' }}>
                    <label htmlFor="cliente" style={{ fontWeight: 'bold', display: 'flex' }}>Cliente</label>
                    <Dropdown
                        value={clienteId}
                        options={clientes}
                        onChange={(e) => setClienteId(e.value)}
                        optionLabel="Nombre"
                        placeholder="Seleccione Cliente"
                    />
                    <Button label='Agregar Cliente' style={{ marginTop: '5px' }} onClick={() => setMostClie(true)} />
                </div>
                <div className="p-field p-col-12 p-md-4" style={{ marginTop: '5px' }}>
                    <label htmlFor="tipoComprobante" style={{ fontWeight: 'bold', display: 'flex' }}>Tipo de Comprobante</label>
                    <Dropdown
                        value={tipoComprobanteId}
                        options={tiposComprobante}
                        onChange={(e) => setTipoComprobanteId(e.value)}
                        optionLabel="Nombre"
                        placeholder="Seleccione Tipo de Comprobante"
                    />
                </div>
                <div className="p-field p-col-12 p-md-4" style={{ marginTop: '5px' }}>
                    <label htmlFor="tipoPago" style={{ fontWeight: 'bold', display: 'flex' }}>Tipo de Pago</label>
                    <Dropdown
                        value={tipoPagoId}
                        options={tiposPago}
                        onChange={(e) => setTipoPagoId(e.value)}
                        optionLabel="Nombre"
                        placeholder="Seleccione Tipo de Pago"
                    />
                </div>
            </div>
            
            {tipoPagoId?.Nombre === 'Efectivo' && (
                <div className="p-field" style={{marginTop:'5px'}}>
                    <label htmlFor="montoRecibido" style={{fontWeight:'bold', display:'flex'}}>Recibido</label>
                    <InputText 
                        id="montoRecibido" 
                        placeholder='Monto recibido'
                        value={montoRecibido}
                        onChange={(e) => setMontoRecibido(e.target.value)}
                    />
                </div>
            )}

            <Divider>
                <div className="inline-flex align-items-center">
                    <i className="pi pi-cart-plus mr-2"></i>
                    <b>Ventas</b>
                </div>
            </Divider>

            <div className="p-grid p-formgrid">
                <div className="p-field p-col-12 p-md-8" style={{ marginTop: '5px' }}>
                    <label htmlFor="producto" style={{ fontWeight: 'bold', display: 'flex' }}>Producto</label>
                    <Dropdown
                        value={selectedProducto}
                        options={productos}
                        onChange={(e) => setSelectedProducto(e.value)}
                        optionLabel="Nombre"
                        placeholder="Seleccione Producto"
                        style={{ width: '100%' }}
                    />

                </div>
                {selectedProducto && (
                    <p>El producto tiene un stock de: {selectedProducto.Stock}</p>
                )}
                {selectedProducto && (
                    <div className="p-field p-col-12 p-md-4" style={{ marginTop: '5px' }}>
                        <label htmlFor="cantidad" style={{ fontWeight: 'bold', display: 'flex' }}>Cantidad</label>
                        <InputNumber
                            value={cantidad}
                            onValueChange={(e) => setCantidad(e.value)}
                            min={1}
                            showButtons
                            buttonLayout="horizontal"
                            style={{ width: '100%' }}
                        />
                    </div>
                )}
            </div>

            <Button  label="Agregar Producto" icon="pi pi-plus" onClick={handleAddProduct} className="p-button-success" style={{ marginBottom: '1rem',marginTop: '1rem' }} />

            <DataTable value={ventas} header="Productos en Venta" className="p-datatable-sm">
                <Column field="nombre" header="Producto" />
                <Column field="cantidad" header="Cantidad" />
                <Column field="precio" header="Precio" />
                <Column header="Subtotal" body={(rowData) => (rowData.cantidad * rowData.precio).toFixed(2)} />
            </DataTable>

            <div className="p-d-flex p-jc-between" style={{ marginTop: '1rem' }}>
                <b>Total:</b>
                <span>${calcularTotal().toFixed(2)}</span>
            </div>

            <Button label="Guardar Venta" icon="pi pi-check" onClick={handleSubmit} className="p-button-success" style={{ marginTop: '1rem' }} />

            {/* Dialog for adding new client */}
            <Dialog header="Agregar Cliente" visible={MostClie} style={{ width: '50vw' }} onHide={() => setMostClie(false)}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="DNI" style={{ fontWeight: 'bold' }}>DNI</label>
                        <InputText id="DNI" value={cliente.DNI} onChange={(e) => handleInputChangeCliente(e, 'DNI')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="Nombre" style={{ fontWeight: 'bold' }}>Nombre</label>
                        <InputText id="Nombre" value={cliente.Nombre} onChange={(e) => handleInputChangeCliente(e, 'Nombre')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="Apellido" style={{ fontWeight: 'bold' }}>Apellido</label>
                        <InputText id="Apellido" value={cliente.Apellido} onChange={(e) => handleInputChangeCliente(e, 'Apellido')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="Telefono" style={{ fontWeight: 'bold' }}>Teléfono</label>
                        <InputText id="Telefono" value={cliente.Telefono} onChange={(e) => handleInputChangeCliente(e, 'Telefono')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="Correo" style={{ fontWeight: 'bold' }}>Correo</label>
                        <InputText id="Correo" value={cliente.Correo} onChange={(e) => handleInputChangeCliente(e, 'Correo')} />
                    </div>
                    <Button label="Agregar Cliente" icon="pi pi-plus" onClick={handleSubmitCliente} className="p-button-success" />
                </div>
            </Dialog>

            <Button style={{ marginTop: '5px' }} label="Vista Previa del PDF" icon="pi pi-file-pdf" onClick={() => setVerPDF(true)} className="p-button-info" />
            {ventas.length > 0 && (
                <Dialog header="Vista Previa" visible={VerPDF} style={{ width: '50vw' }} onHide={() => setVerPDF(false)}>
                    <GenerarPDF
                        cliente={clienteId}
                        tipoComprobante={tipoComprobanteId}
                        tipoPago={tipoPagoId}
                        montoRecibido={montoRecibido}
                        ventas={ventas}
                        total={calcularTotal()}
                        cambio={tipoPagoId?.Nombre === 'Efectivo' ? (montoRecibido - calcularTotal()) : 0}
                    />
                </Dialog>
            )}
        
        </div>
    );
};

export default AgregarVenta;
