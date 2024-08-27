import { useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import FulLuz from '../img/FulLuz.jpeg';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';
import axios from 'axios';

export default function Login({ onLogin }) {
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
        setLoading(true);
        setError(""); // Clear error before a new attempt
    
        if (!correo || !contraseña) {
            setError("Por favor, complete todos los campos.");
            setLoading(false);
            return;
        }
    
        try {
            console.log("Datos enviados:", { correo, contraseña });
    
            const response = await axios.post("http://localhost:8081/login", {
                correo,
                contraseña
            });
    
            console.log("Respuesta del servidor:", response.data);
    
            if (response.data.success) {
                onLogin(response.data.usuario); // Usa 'usuario' en lugar de 'user'
                navigate('/principal');
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "Error al iniciar sesión.");
            } else if (error.request) {
                setError("No se pudo conectar con el servidor.");
            } else {
                setError("Ocurrió un error inesperado.");
            }
        } finally {
            setLoading(false);
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
                    <p style={{ fontWeight: 'bold', display: 'flex' }}>Correo</p>
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user" />
                        </span>
                        <InputText 
                            placeholder="Ingrese correo..." 
                            style={{ width: "300px" }} 
                            value={correo} 
                            onChange={(e) => setCorreo(e.target.value)}
                            disabled={loading}
                        />
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
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                            disabled={loading}
                        />
                        <Button 
                            icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"} 
                            onClick={toggleShowPassword}
                            className="p-button-secondary" 
                            style={{ height: '35px' }}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            disabled={loading}
                        />
                    </div>
                </div>
                {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                <a href="/registro" style={{ marginTop: '1rem', display: 'block' }}>Registrarse</a>
                <Button 
                    label="Ingresar" 
                    style={{ marginTop: "1rem" }} 
                    onClick={handleLogin} 
                    disabled={loading} 
                    loading={loading} 
                />
            </Card>
        </div>
    );
}
