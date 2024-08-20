import { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import FulLuz from "../img/FulLuz.jpeg";
import "../css/login.css";

export default function Registro() {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
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
                        borderRadius: "50%", // Hace la imagen circular
                        border: "3px solid #203b7a" // Borde de color azul
                    }}
                />
                <div>
                    <p style={{ fontWeight: 'bold', display:'flex' }}>Registar Correo</p>
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user" />
                        </span>
                        <InputText placeholder="Ingrese correo..." style={{ width: "300px" }} />
                    </div>
                </div>
                <div style={{ marginTop: "1rem" }}>
                    <p style={{ fontWeight: 'bold', display:'flex' }}>Registrar Contraseña</p>
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-lock" />
                        </span>
                        <InputText 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Ingrese contraseña..." 
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
                            placeholder="Ingrese contraseña..." 
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
                <Button label="Registrar" style={{ marginTop: "1rem" }} />
            </Card>
        </div>
    );
}
