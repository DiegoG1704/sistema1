import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';

export default function Venta() {
    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [tiposComprobante, setTiposComprobante] = useState([]);
    const [tiposPago, setTiposPago] = useState([]);
    const [newVenta, setNewVenta] = useState({
        ClienteId: '',
        TipoComprobanteId: '',
        TipoPagoId: '',
        Total: 0,
        FechVenta: new Date()
    });
    const [productosVenta, setProductosVenta] = useState([{
        ProductoId: '',
        Cantidad: 0,
        Precio: 0,
        Total: 0,
        Stock: 0
    }]);
    const toast = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            await fetchProductos();
            await fetchClientes();
            await fetchTiposComprobante();
            await fetchTipoPagos();
        };
        fetchData();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await axios.get('http://localhost:8081/productos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron obtener los productos.', life: 3000 });
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

    const addVenta = async () => {
    try {
        // Validar campos requeridos
        if (!newVenta.ClienteId || !newVenta.TipoComprobanteId || !newVenta.TipoPagoId) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos son requeridos.', life: 3000 });
            return;
        }

        // Validar cantidad y stock de productos
        for (let producto of productosVenta) {
            if (producto.Cantidad > producto.Stock) {
                toast.current.show({ severity: 'info', summary: 'Info', detail: `La cantidad no puede ser mayor que el stock disponible para el producto ${producto.ProductoId}.`, life: 3000 });
                return;
            }
        }

        // Validar total de la venta
        if (newVenta.Total <= 0) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El total de la venta debe ser mayor a cero.', life: 3000 });
            return;
        }

        // Formatear la fecha de venta
        const formattedFechaVenta = newVenta.FechVenta.toISOString().split('T')[0];

        // Crear el objeto de la venta para enviar
        const ventaToAdd = {
            ClienteId: newVenta.ClienteId,
            TipoComprobanteId: newVenta.TipoComprobanteId,
            TipoPagoId: newVenta.TipoPagoId,
            Total: newVenta.Total,
            FechVenta: formattedFechaVenta,
            Productos: productosVenta.map(producto => ({
                ProductoId: producto.ProductoId,
                Cantidad: producto.Cantidad,
                Precio: producto.Precio,
                Total: producto.Total,
                Stock: producto.Stock
            }))
        };

        // Realizar la solicitud POST al servidor
        const response = await axios.post('http://localhost:8081/ventas', ventaToAdd);
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Venta realizada con éxito', life: 3000 });

        // Reiniciar el estado después de la venta exitosa
        setNewVenta({
            ClienteId: '',
            TipoComprobanteId: '',
            TipoPagoId: '',
            Total: 0,
            FechVenta: new Date()
        });
        setProductosVenta([{
            ProductoId: '',
            Cantidad: 0,
            Precio: 0,
            Total: 0,
            Stock: 0
        }]);
    } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al agregar la venta', life: 3000 });
        console.error('Error al agregar venta:', error);
    }
};


    const handleInputChange = (e, field) => {
        const value = e.value !== undefined ? e.value : e.target.value;
        setNewVenta(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleProductoChange = (e, index, field) => {
        const value = e.value !== undefined ? e.value : e.target.value;
        setProductosVenta(prevState => {
            const newProductosVenta = [...prevState];
            newProductosVenta[index][field] = value;

            if (field === 'ProductoId') {
                const selectedProduct = productos.find(producto => producto.Id === value);
                if (selectedProduct) {
                    newProductosVenta[index].Precio = selectedProduct.PrecioVenta;
                    newProductosVenta[index].Stock = selectedProduct.Stock;
                } else {
                    newProductosVenta[index].Precio = 0;
                    newProductosVenta[index].Stock = 0;
                }
            }

            if (field === 'Cantidad') {
                newProductosVenta[index].Total = newProductosVenta[index].Cantidad * newProductosVenta[index].Precio;
            }

            calcularTotalGeneral(newProductosVenta);

            return newProductosVenta;
        });
    };

    const calcularTotalGeneral = (productosVenta) => {
        const total = productosVenta.reduce((acc, producto) => acc + producto.Total, 0);
        setNewVenta(prevState => ({
            ...prevState,
            Total: total
        }));
    };

    const addProducto = () => {
        setProductosVenta(prevState => [
            ...prevState,
            {
                ProductoId: '',
                Cantidad: 0,
                Precio: 0,
                Total: 0,
                Stock: 0
            }
        ]);
    };

    const [MostClie, setMostClie] = useState(false);
    const [cliente, setCliente] = useState({
        DNI: '',
        Nombre: '',
        Apellido: '',
        Telefono: '',
        Correo: ''
    });

    const handleInputChangeCliente = (e, field) => {
        const value = e.value !== undefined ? e.value : e.target.value;
        setCliente(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8081/clientes', cliente);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: `Cliente agregado con exito`, life: 3000 });

            setCliente({
                DNI: '',
                Nombre: '',
                Apellido: '',
                Telefono: '',
                Correo: ''
            });

            fetchClientes();

            setMostClie(false);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al agregar cliente', life: 3000 });
            console.error('Error al agregar cliente:', error);
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="p-fluid flex" style={{ width: '100%' }}>
                <div className="p-field" style={{marginTop:'5px'}}>
                    <label htmlFor="fechaVenta" style={{fontWeight:'bold', display:'flex'}}>Fecha de Venta</label>
                    <Calendar id="fechaVenta" disabled value={newVenta.FechVenta} onChange={(e) => handleInputChange(e, 'FechVenta')} showIcon />
                </div>
                <div className="p-field" style={{ display: 'flex'}}>
                    <div style={{marginTop:'5px' , width:'80%'}}>
                        <label htmlFor="cliente" style={{fontWeight:'bold', display:'flex'}}>Cliente</label>
                        <Dropdown id="cliente" style={{ display: 'flex'}} value={newVenta.ClienteId} options={clientes} onChange={(e) => handleInputChange(e, 'ClienteId')} optionLabel="Nombre" optionValue="Id" placeholder="Seleccionar Cliente" />
                    </div>
                    <Button label='Agregar Cliente' style={{width:'20%', height:'40px', marginTop:'25px', marginLeft:'5px'}} onClick={() => setMostClie(true)} />
                </div>
                <div className="p-field" style={{marginTop:'5px'}}>
                    <label htmlFor="tipoComprobante" style={{fontWeight:'bold', display:'flex'}}>Tipo de Comprobante</label>
                    <Dropdown id="tipoComprobante" value={newVenta.TipoComprobanteId} options={tiposComprobante} onChange={(e) => handleInputChange(e, 'TipoComprobanteId')} optionLabel="Nombre" optionValue="Id" placeholder="Seleccionar Tipo Comprobante" />
                </div>
                <div className="p-field" style={{marginTop:'5px'}}>
                    <label htmlFor="tipoPago" style={{fontWeight:'bold', display:'flex'}}>Tipo de Pago</label>
                    <Dropdown id="tipoPago" value={newVenta.TipoPagoId} options={tiposPago} onChange={(e) => handleInputChange(e, 'TipoPagoId')} optionLabel="Nombre" optionValue="Id" placeholder="Seleccionar Tipo Pago" />
                </div>

                <Divider style={{height: '3px'}}/>
                {productosVenta.map((productoVenta, index) => (
                    <div key={index} className="p-field" style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '5px' }}>
                        <div className="p-field" style={{marginTop:'5px'}}>
                            <label htmlFor={`producto-${index}`} style={{fontWeight:'bold', display:'flex'}}>Producto</label>
                            <Dropdown id={`producto-${index}`} value={productoVenta.ProductoId} options={productos} onChange={(e) => handleProductoChange(e, index, 'ProductoId')} optionLabel="Nombre" optionValue="Id" placeholder="Seleccionar Producto" />
                        </div>
                        <div className="p-field" style={{marginTop:'5px'}}>
                            <label htmlFor={`cantidad-${index}`} style={{fontWeight:'bold', display:'flex'}}>Cantidad</label>
                            <InputNumber id={`cantidad-${index}`} value={productoVenta.Cantidad} onValueChange={(e) => handleProductoChange(e, index, 'Cantidad')} mode="decimal" min={0} max={productoVenta.Stock} placeholder="Cantidad" />
                        </div>
                        <div className="p-field" style={{marginTop:'5px'}}>
                            <label htmlFor={`precio-${index}`} style={{fontWeight:'bold', display:'flex'}}>Precio</label>
                            <InputNumber id={`precio-${index}`} value={productoVenta.Precio} disabled placeholder="Precio" />
                        </div>
                        <div className="p-field" style={{marginTop:'5px'}}>
                            <label htmlFor={`total-${index}`} style={{fontWeight:'bold', display:'flex'}}>Total</label>
                            <InputNumber id={`total-${index}`} value={productoVenta.Total} disabled placeholder="Total" />
                        </div>
                    </div>
                ))}
                <Button label="Agregar Producto" className="p-button-success" onClick={addProducto} />

                <div className="p-field" style={{marginTop:'5px'}}>
                    <label htmlFor="totalGeneral" style={{fontWeight:'bold', display:'flex'}}>Total General</label>
                    <InputNumber id="totalGeneral" value={newVenta.Total} disabled placeholder="Total General" />
                </div>

                <div className="p-field" style={{marginTop:'5px'}}>
                    <Button label="Registrar Venta" className="p-button-primary" onClick={addVenta} />
                </div>
            </div>

            <Dialog header="Agregar Cliente" visible={MostClie} style={{ width: '50vw' }} onHide={() => setMostClie(false)}>
                <div className="p-fluid">
                    <div className="p-field" style={{marginTop:'5px'}}>
                        <label htmlFor="dni" style={{fontWeight:'bold', display:'flex'}}>DNI</label>
                        <InputText id="dni" value={cliente.DNI} onChange={(e) => handleInputChangeCliente(e, 'DNI')} />
                    </div>
                    <div className="p-field" style={{marginTop:'5px'}}>
                        <label htmlFor="nombre" style={{fontWeight:'bold', display:'flex'}}>Nombre</label>
                        <InputText id="nombre" value={cliente.Nombre} onChange={(e) => handleInputChangeCliente(e, 'Nombre')} />
                    </div>
                    <div className="p-field" style={{marginTop:'5px'}}>
                        <label htmlFor="apellido" style={{fontWeight:'bold', display:'flex'}}>Apellido</label>
                        <InputText id="apellido" value={cliente.Apellido} onChange={(e) => handleInputChangeCliente(e, 'Apellido')} />
                    </div>
                    <div className="p-field" style={{marginTop:'5px'}}>
                        <label htmlFor="telefono" style={{fontWeight:'bold', display:'flex'}}>Teléfono</label>
                        <InputText id="telefono" value={cliente.Telefono} onChange={(e) => handleInputChangeCliente(e, 'Telefono')} />
                    </div>
                    <div className="p-field" style={{marginTop:'5px'}}>
                        <label htmlFor="correo" style={{fontWeight:'bold', display:'flex'}}>Correo</label>
                        <InputText id="correo" value={cliente.Correo} onChange={(e) => handleInputChangeCliente(e, 'Correo')} />
                    </div>
                </div>
                <Button label="Guardar" className="p-button-primary" onClick={handleSubmit} />
            </Dialog>
        </>
    );
}
