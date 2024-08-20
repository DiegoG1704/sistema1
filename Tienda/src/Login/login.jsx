import { useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import FulLuz from '../img/FulLuz.jpeg';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';

export default function Login({ onLogin }) {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = () => {
        onLogin(); // Llama a la función de login que se pasa como prop
        navigate('/principal'); // Redirige a la página principal después del login
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
                    <p style={{ fontWeight: 'bold', display: 'flex' }}>Correo</p>
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user" />
                        </span>
                        <InputText placeholder="Ingrese correo..." style={{ width: "300px" }} />
                    </div>
                </div>
                <div style={{ marginTop: "1rem" }}>
                    <p style={{ fontWeight: 'bold', display: 'flex' }}>Contraseña</p>
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
                            style={{ height: '35px' }}
                        />
                    </div>
                </div>
                <a href="/registro">Registrarse</a>
                <Button label="Ingresar" style={{ marginTop: "1rem" }} onClick={handleLogin} />
            </Card>
        </div>
    );
}
