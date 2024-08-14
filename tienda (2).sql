-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-08-2024 a las 02:09:58
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tienda`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `Id` int(11) NOT NULL,
  `DNI` varchar(20) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Apellido` varchar(50) NOT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `Correo` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`Id`, `DNI`, `Nombre`, `Apellido`, `Telefono`, `Correo`) VALUES
(1, '72217895', 'Diego', 'Guevara', '999458360', 'dgst1704@gmail.com'),
(2, '10645699', 'matias', 'Capuñay', '999458378', 'bebito@gmail.com'),
(3, '10645699', 'Jade', 'Capuñay', '999458378', 'brujis@gmail.com'),
(4, '72217893', 'Miguel', 'Capuñay ', '945011010', 'Miguel@gmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compramaterial`
--

CREATE TABLE `compramaterial` (
  `Id` int(11) NOT NULL,
  `MaterialId` int(11) DEFAULT NULL,
  `Cantidad` int(11) NOT NULL,
  `FechaCompra` date NOT NULL,
  `PrecioTotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empaquetado`
--

CREATE TABLE `empaquetado` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empaquetado`
--

INSERT INTO `empaquetado` (`Id`, `Nombre`, `Cantidad`) VALUES
(1, 'Caja', 50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

CREATE TABLE `estado` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado`
--

INSERT INTO `estado` (`Id`, `Nombre`) VALUES
(1, 'Disponible'),
(2, 'No Disponible');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gastos`
--

CREATE TABLE `gastos` (
  `Id` int(11) NOT NULL,
  `PagoServiciosId` int(11) DEFAULT NULL,
  `CompraMaterialId` int(11) DEFAULT NULL,
  `PagoTrabajadoresId` int(11) DEFAULT NULL,
  `GastoTotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `identificacion`
--

CREATE TABLE `identificacion` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `material`
--

CREATE TABLE `material` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `PrecioCompra` decimal(10,2) NOT NULL,
  `UnidadMedidaId` int(11) DEFAULT NULL,
  `ProveedorId` int(11) DEFAULT NULL,
  `ProductoId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagoservicios`
--

CREATE TABLE `pagoservicios` (
  `Id` int(11) NOT NULL,
  `ServiciosId` int(11) DEFAULT NULL,
  `PagoTotal` decimal(10,2) NOT NULL,
  `FechaPago` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagotrabajadores`
--

CREATE TABLE `pagotrabajadores` (
  `Id` int(11) NOT NULL,
  `TrabajadorId` int(11) DEFAULT NULL,
  `SueldoPagado` decimal(10,2) NOT NULL,
  `FechaPago` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(50) DEFAULT NULL,
  `PrecioVenta` decimal(10,2) DEFAULT NULL,
  `FechaProduccion` date DEFAULT NULL,
  `Stock` int(11) DEFAULT NULL,
  `EmpaquetadoId` int(11) DEFAULT NULL,
  `EstadoId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`Id`, `Nombre`, `PrecioVenta`, `FechaProduccion`, `Stock`, `EmpaquetadoId`, `EstadoId`) VALUES
(1, 'tomacorriente', 12.00, '2024-08-03', 9, 1, 1),
(2, 'enchufe', 10.00, '2024-08-04', 7, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `Id` int(11) NOT NULL,
  `IdentificacionId` int(11) DEFAULT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Apellido` varchar(50) NOT NULL,
  `Telefono` int(11) NOT NULL,
  `Correo` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puesto`
--

CREATE TABLE `puesto` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Sueldo` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Precio` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipocomprobante`
--

CREATE TABLE `tipocomprobante` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipocomprobante`
--

INSERT INTO `tipocomprobante` (`Id`, `Nombre`) VALUES
(1, 'Factura'),
(2, 'Boleta');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipopago`
--

CREATE TABLE `tipopago` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipopago`
--

INSERT INTO `tipopago` (`Id`, `Nombre`) VALUES
(1, 'Efectivo'),
(2, 'Tarjeta');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trabajador`
--

CREATE TABLE `trabajador` (
  `Id` int(11) NOT NULL,
  `DNI` varchar(20) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Apellido` varchar(50) NOT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `Correo` varchar(50) DEFAULT NULL,
  `PuestoId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidadmedida`
--

CREATE TABLE `unidadmedida` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `Id` int(11) NOT NULL,
  `ClienteId` int(11) DEFAULT NULL,
  `TipoComprobanteId` int(11) DEFAULT NULL,
  `TipoPagoId` int(11) DEFAULT NULL,
  `Total` decimal(10,2) NOT NULL,
  `Fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `venta`
--

INSERT INTO `venta` (`Id`, `ClienteId`, `TipoComprobanteId`, `TipoPagoId`, `Total`, `Fecha`) VALUES
(15, 1, 1, 2, 34.00, '2024-08-11'),
(16, 4, 1, 2, 22.00, '2024-08-11'),
(17, 3, 1, 2, 22.00, '2024-08-11'),
(18, 3, 1, 1, 22.00, '2024-08-11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventaproducto`
--

CREATE TABLE `ventaproducto` (
  `Id` int(11) NOT NULL,
  `VentaId` int(11) DEFAULT NULL,
  `ProductoId` int(11) DEFAULT NULL,
  `Cantidad` int(11) NOT NULL,
  `Precio` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventaproducto`
--

INSERT INTO `ventaproducto` (`Id`, `VentaId`, `ProductoId`, `Cantidad`, `Precio`) VALUES
(1, 15, 1, 2, 12.00),
(2, 15, 2, 1, 10.00),
(3, 16, 1, 1, 12.00),
(4, 16, 2, 1, 10.00),
(5, 17, 1, 1, 12.00),
(6, 17, 2, 1, 10.00),
(7, 18, 1, 1, 12.00),
(8, 18, 2, 1, 10.00);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `compramaterial`
--
ALTER TABLE `compramaterial`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `MaterialId` (`MaterialId`);

--
-- Indices de la tabla `empaquetado`
--
ALTER TABLE `empaquetado`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `gastos`
--
ALTER TABLE `gastos`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `PagoServiciosId` (`PagoServiciosId`),
  ADD KEY `CompraMaterialId` (`CompraMaterialId`),
  ADD KEY `PagoTrabajadoresId` (`PagoTrabajadoresId`);

--
-- Indices de la tabla `identificacion`
--
ALTER TABLE `identificacion`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `material`
--
ALTER TABLE `material`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `UnidadMedidaId` (`UnidadMedidaId`),
  ADD KEY `ProveedorId` (`ProveedorId`),
  ADD KEY `ProductoId` (`ProductoId`);

--
-- Indices de la tabla `pagoservicios`
--
ALTER TABLE `pagoservicios`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `ServiciosId` (`ServiciosId`);

--
-- Indices de la tabla `pagotrabajadores`
--
ALTER TABLE `pagotrabajadores`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `TrabajadorId` (`TrabajadorId`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `EmpaquetadoId` (`EmpaquetadoId`),
  ADD KEY `EstadoId` (`EstadoId`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IdentificacionId` (`IdentificacionId`);

--
-- Indices de la tabla `puesto`
--
ALTER TABLE `puesto`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `tipocomprobante`
--
ALTER TABLE `tipocomprobante`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `tipopago`
--
ALTER TABLE `tipopago`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `trabajador`
--
ALTER TABLE `trabajador`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `PuestoId` (`PuestoId`);

--
-- Indices de la tabla `unidadmedida`
--
ALTER TABLE `unidadmedida`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `ClienteId` (`ClienteId`),
  ADD KEY `TipoComprobanteId` (`TipoComprobanteId`),
  ADD KEY `TipoPagoId` (`TipoPagoId`);

--
-- Indices de la tabla `ventaproducto`
--
ALTER TABLE `ventaproducto`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `VentaId` (`VentaId`),
  ADD KEY `ProductoId` (`ProductoId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `compramaterial`
--
ALTER TABLE `compramaterial`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empaquetado`
--
ALTER TABLE `empaquetado`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `estado`
--
ALTER TABLE `estado`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `gastos`
--
ALTER TABLE `gastos`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `identificacion`
--
ALTER TABLE `identificacion`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `material`
--
ALTER TABLE `material`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pagoservicios`
--
ALTER TABLE `pagoservicios`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pagotrabajadores`
--
ALTER TABLE `pagotrabajadores`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `puesto`
--
ALTER TABLE `puesto`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipocomprobante`
--
ALTER TABLE `tipocomprobante`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tipopago`
--
ALTER TABLE `tipopago`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `trabajador`
--
ALTER TABLE `trabajador`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `unidadmedida`
--
ALTER TABLE `unidadmedida`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `ventaproducto`
--
ALTER TABLE `ventaproducto`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `compramaterial`
--
ALTER TABLE `compramaterial`
  ADD CONSTRAINT `compramaterial_ibfk_1` FOREIGN KEY (`MaterialId`) REFERENCES `material` (`Id`);

--
-- Filtros para la tabla `gastos`
--
ALTER TABLE `gastos`
  ADD CONSTRAINT `gastos_ibfk_1` FOREIGN KEY (`PagoServiciosId`) REFERENCES `pagoservicios` (`Id`),
  ADD CONSTRAINT `gastos_ibfk_2` FOREIGN KEY (`CompraMaterialId`) REFERENCES `compramaterial` (`Id`),
  ADD CONSTRAINT `gastos_ibfk_3` FOREIGN KEY (`PagoTrabajadoresId`) REFERENCES `pagotrabajadores` (`Id`);

--
-- Filtros para la tabla `material`
--
ALTER TABLE `material`
  ADD CONSTRAINT `material_ibfk_1` FOREIGN KEY (`UnidadMedidaId`) REFERENCES `unidadmedida` (`Id`),
  ADD CONSTRAINT `material_ibfk_2` FOREIGN KEY (`ProveedorId`) REFERENCES `proveedor` (`Id`),
  ADD CONSTRAINT `material_ibfk_3` FOREIGN KEY (`ProductoId`) REFERENCES `producto` (`Id`);

--
-- Filtros para la tabla `pagoservicios`
--
ALTER TABLE `pagoservicios`
  ADD CONSTRAINT `pagoservicios_ibfk_1` FOREIGN KEY (`ServiciosId`) REFERENCES `servicios` (`Id`);

--
-- Filtros para la tabla `pagotrabajadores`
--
ALTER TABLE `pagotrabajadores`
  ADD CONSTRAINT `pagotrabajadores_ibfk_1` FOREIGN KEY (`TrabajadorId`) REFERENCES `trabajador` (`Id`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`EmpaquetadoId`) REFERENCES `empaquetado` (`Id`),
  ADD CONSTRAINT `producto_ibfk_2` FOREIGN KEY (`EstadoId`) REFERENCES `estado` (`Id`);

--
-- Filtros para la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD CONSTRAINT `proveedor_ibfk_1` FOREIGN KEY (`IdentificacionId`) REFERENCES `identificacion` (`Id`);

--
-- Filtros para la tabla `trabajador`
--
ALTER TABLE `trabajador`
  ADD CONSTRAINT `trabajador_ibfk_1` FOREIGN KEY (`PuestoId`) REFERENCES `puesto` (`Id`);

--
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `venta_ibfk_2` FOREIGN KEY (`ClienteId`) REFERENCES `cliente` (`Id`),
  ADD CONSTRAINT `venta_ibfk_3` FOREIGN KEY (`TipoComprobanteId`) REFERENCES `tipocomprobante` (`Id`),
  ADD CONSTRAINT `venta_ibfk_4` FOREIGN KEY (`TipoPagoId`) REFERENCES `tipopago` (`Id`);

--
-- Filtros para la tabla `ventaproducto`
--
ALTER TABLE `ventaproducto`
  ADD CONSTRAINT `ventaproducto_ibfk_1` FOREIGN KEY (`VentaId`) REFERENCES `venta` (`Id`),
  ADD CONSTRAINT `ventaproducto_ibfk_2` FOREIGN KEY (`ProductoId`) REFERENCES `producto` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
