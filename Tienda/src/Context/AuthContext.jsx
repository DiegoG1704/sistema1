import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Crea el contexto de autenticación
const AuthContext = createContext();

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8081/login', { email, password });
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Guarda el usuario en localStorage
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Elimina el usuario del localStorage
  };

  // Carga el usuario desde el localStorage al montar el componente
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};
