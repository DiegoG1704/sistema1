import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';

export default function VGeneral({ userId }) {
  // Accede a la propiedad `userId` si `userId` es un objeto
  const actualUserId = userId?.userId || userId; 
  const [Historial, setHistorial] = useState([]);
  const [first, setFirst] = useState(0); // Index of the first item in the current page
  const [rows, setRows] = useState(6);   // Number of items per page

  useEffect(() => {
    if (actualUserId) {
      const fetchHistorial = async () => {
        try {
          const response = await axios.get(`http://localhost:8081/productos-vendidos/${actualUserId}`);
          setHistorial(response.data);
        } catch (error) {
          console.error('Error al obtener el historial de ventas:', error);
        }
      };
      fetchHistorial();
    }
  }, [actualUserId]);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  return (
    <div className="card">
      <DataTable
        value={Historial}
        paginator
        rows={rows}
        first={first}
        onPage={onPageChange}
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} elementos"
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column field="Nombre" header="Nombre" />
        <Column field="Cantidad" header="Cantidad" />
        <Column field="Precio" header="Precio" />
        <Column field="Fecha" header="Fecha" body={(rowData) => new Date(rowData.Fecha).toLocaleDateString()} />
      </DataTable>
    </div>
  );
}
