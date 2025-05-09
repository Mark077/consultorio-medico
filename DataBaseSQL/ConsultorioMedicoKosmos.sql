-- Crear la base de datos
CREATE DATABASE consultorio_medico;
USE consultorio_medico;

-- Tabla de Usuarios (Pacientes)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Doctores
CREATE TABLE doctores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20)
);

-- Tabla de Consultas
CREATE TABLE consultas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    doctor_id INT NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_consulta DATETIME NOT NULL,
    motivo TEXT NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada') DEFAULT 'pendiente',
    notas TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (doctor_id) REFERENCES doctores(id)
);

-- Tabla de Tratamientos
CREATE TABLE tratamientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    consulta_id INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    dosis TEXT,
    frecuencia TEXT,
    estado ENUM('activo', 'completado', 'suspendido') DEFAULT 'activo',
    FOREIGN KEY (consulta_id) REFERENCES consultas(id)
);

-- Tabla de Seguimiento
CREATE TABLE seguimiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tratamiento_id INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT NOT NULL,
    efectividad ENUM('excelente', 'buena', 'regular', 'mala'),
    FOREIGN KEY (tratamiento_id) REFERENCES tratamientos(id)
);