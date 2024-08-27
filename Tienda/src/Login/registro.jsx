import { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import FulLuz from "../img/FulLuz.jpeg";
import "../css/login.css";

export default function Registro() {
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [confirmarContraseña, setConfirmarContraseña] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = async () => {
        // Verificar si las contraseñas coinciden
        if (contraseña !== confirmarContraseña) {
            alert("Las contraseñas no coinciden. Por favor, inténtelo de nuevo.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8081/registro", {
                nombreUsuario,
                correo,
                contraseña
            });

            if (response.data.success) {
                alert("Usuario registrado exitosamente");
                window.location.href = "/Login";
            } else {
                alert("Error al registrar el usuario");
            }
        } catch (error) {
            console.error("Error al registrar el usuario:", error);
            alert("Error en la conexión con el servidor");
        }
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: '100%',
            background: '#1d2340'
        }}>
            <Card style={{ width: "400px", textAlign: "center" }}>
                <img 
                    src={FulLuz} 
                    alt="FulLuz" 
                    style={{
                        height: "100px",
                        width: "100px",
                        borderRadius: "50%", 
                        border: "3px solid #203b7a" 
                    }}
                />
                <div>
                    <p style={{ fontWeight: 'bold', display:'flex' }}>Nombre de Usuario</p>
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user" />
                        </span>
                        <InputText 
                            placeholder="Ingrese nombre de usuario..." 
                            value={nombreUsuario}
                            onChange={(e) => setNombreUsuario(e.target.value)}
                            style={{ width: "300px" }} 
                        />
                    </div>
                </div>
                <div style={{ marginTop: "1rem" }}>
                    <p style={{ fontWeight: 'bold', display:'flex' }}>Correo</p>
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-envelope" />
                        </span>
                        <InputText 
                            placeholder="Ingrese correo..." 
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            style={{ width: "300px" }} 
                        />
                    </div>
                </div>
                <div style={{ marginTop: "1rem" }}>
                    <p style={{ fontWeight: 'bold', display:'flex' }}>Contraseña</p>
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-lock" />
                        </span>
                        <InputText 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Ingrese contraseña..." 
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                            style={{ width: "300px" }} 
                        />
                        <Button 
                            icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"} 
                            onClick={toggleShowPassword}
                            className="p-button-secondary" 
                            style={{height:'35px'}}
                        />
                    </div>
                </div>
                <div style={{ marginTop: "1rem" }}>
                    <p style={{ fontWeight: 'bold', display:'flex' }}>Confirmar Contraseña</p>
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-lock" />
                        </span>
                        <InputText 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Confirme contraseña..." 
                            value={confirmarContraseña}
                            onChange={(e) => setConfirmarContraseña(e.target.value)}
                            style={{ width: "300px" }} 
                        />
                        <Button 
                            icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"} 
                            onClick={toggleShowPassword}
                            className="p-button-secondary" 
                            style={{height:'35px'}}
                        />
                    </div>
                </div>
                <a href="/Login">Ir al Login</a>
                <Button label="Registrar" onClick={handleRegister} style={{ marginTop: "1rem" }} />
            </Card>
        </div>
    );
}
