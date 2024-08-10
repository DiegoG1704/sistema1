// GenerarPDF.jsx
import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from 'primereact/button';

const GenerarPDF = ({ cliente, tipoComprobante, tipoPago, montoRecibido, ventas, total, cambio }) => {
    
    const handleGeneratePDF = () => {
        const input = document.getElementById('pdf-content');

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('venta.pdf');
        });
    };

    return (
        <div>
            <div id="pdf-content" style={{ padding: '1rem' }}>
                <h2>Detalles de la Venta</h2>
                <div style={{ marginBottom: '1rem' }}>
                    <h3>Cliente</h3>
                    <p><strong>Nombre:</strong> {cliente.Nombre}</p>
                    <p><strong>DNI:</strong> {cliente.DNI}</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <h3>Tipo de Comprobante</h3>
                    <p>{tipoComprobante.Nombre}</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <h3>Tipo de Pago</h3>
                    <p>{tipoPago.Nombre}</p>
                </div>
                {tipoPago.Nombre === 'Efectivo' && (
                    <div style={{ marginBottom: '1rem' }}>
                        <h3>Monto Recibido</h3>
                        <p>{montoRecibido}</p>
                    </div>
                )}
                <div style={{ marginBottom: '1rem' }}>
                    <h3>Productos</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #000', padding: '5px' }}>Producto</th>
                                <th style={{ border: '1px solid #000', padding: '5px' }}>Cantidad</th>
                                <th style={{ border: '1px solid #000', padding: '5px' }}>Precio</th>
                                <th style={{ border: '1px solid #000', padding: '5px' }}>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.map((venta, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #000', padding: '5px' }}>{venta.nombre}</td>
                                    <td style={{ border: '1px solid #000', padding: '5px' }}>{venta.cantidad}</td>
                                    <td style={{ border: '1px solid #000', padding: '5px' }}>{venta.precio}</td>
                                    <td style={{ border: '1px solid #000', padding: '5px' }}>{(venta.cantidad * venta.precio).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <p><strong>Total:</strong> ${total.toFixed(2)}</p>
                    {tipoPago.Nombre === 'Efectivo' && <p><strong>Cambio:</strong> ${cambio.toFixed(2)}</p>}
                </div>
            </div>
            <Button label="Generar PDF" onClick={handleGeneratePDF} className="p-button-success" />
        </div>
    );
};

export default GenerarPDF;
