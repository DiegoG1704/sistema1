import React, { useState, useEffect } from 'react';
import '../css/Usuario.css'; 
import 'primeicons/primeicons.css';
import axios from 'axios';
import User from '../img/user.png';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';

function VUsuario({ userId, onProfileImageUpdated }) {
    const [usuario, setUsuario] = useState({
        NombreUsuario: '',
        Correo: '',
        fotoPerfil: ''
    });
    const [displayDialog, setDisplayDialog] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchUsuario = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/Usuario/${userId}`);
            setUsuario(response.data);
            setSelectedImage(`http://localhost:8081/uploads/${response.data.fotoPerfil}`);
        } catch (error) {
            console.error('Error al obtener Usuario:', error);
        }
    };

    useEffect(() => {
        fetchUsuario();
    }, [userId]);

    const handleImageUpload = async ({ files }) => {
        const file = files[0];
        const formData = new FormData();
        formData.append('image', file);
    
        try {
            const response = await axios.post(`http://localhost:8081/Usuario/${userId}/uploadProfileImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const { fotoPerfil } = response.data;
            if (typeof fotoPerfil === 'string') {
                setUsuario(prevState => ({ ...prevState, fotoPerfil }));
                setSelectedImage(`http://localhost:8081/uploads/${fotoPerfil}`);
                onProfileImageUpdated(fotoPerfil); // Notificar al Navbar que la imagen ha sido actualizada
            } else {
                console.error('El valor de fotoPerfil no es una cadena de texto:', fotoPerfil);
            }
            setDisplayDialog(false);
        } catch (error) {
            console.error('Error al subir la imagen:', error);
        }
    };

    const handleImageSelect = (e) => {
        const file = e.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            setSelectedImage(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="usuario-container">
            <div className="user-header">
                <div className="user-image-container">
                    <img 
                        src={usuario.fotoPerfil ? `http://localhost:8081/uploads/${usuario.fotoPerfil}` : User} 
                        alt="User" 
                        className="user-icon1" 
                    />
                    <Button 
                        icon="pi pi-pencil" 
                        className="edit-button" 
                        onClick={() => setDisplayDialog(true)} 
                        aria-label="Edit Image"
                    />
                </div>
                <h1>{usuario.NombreUsuario ? `Hola, ${usuario.NombreUsuario}` : 'Usuario'}</h1>
            </div>

            <div className="user-info">
                <div className="info-field">
                    <label htmlFor="Nombre" className="info-label">Nombre de Usuario:</label>
                    <InputText id="Nombre" value={usuario.NombreUsuario} readOnly className="info-input"/>
                </div>
                <div className="info-field">
                    <label htmlFor="Correo" className="info-label">Correo:</label>
                    <InputText id="Correo" value={usuario.Correo} readOnly className="info-input"/>
                </div>
            </div>

            <Dialog 
                visible={displayDialog} 
                style={{ width: '50vw' }} 
                header="Editar Imagen" 
                modal 
                onHide={() => setDisplayDialog(false)}
            >
                <div className="dialog-content">
                    {selectedImage && (
                        <img src={selectedImage} style={{ width: '400px' }} alt="Previsualización" className="preview-image" />
                    )}
                    <FileUpload 
                        mode="basic" 
                        chooseLabel="Seleccionar Imagen" 
                        customUpload 
                        uploadHandler={handleImageUpload} 
                        accept="image/*"
                        maxFileSize={1000000}
                        onSelect={handleImageSelect}
                        style={{marginTop:'20px'}}
                    />
                </div>
            </Dialog>
        </div>
    );
}

export default VUsuario;
