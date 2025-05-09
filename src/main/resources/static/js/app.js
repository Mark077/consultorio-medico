	document.addEventListener('DOMContentLoaded', function() {
    // Cargar doctores al iniciar
    cargarDoctores();
    
    // Manejar registro de usuario
    document.getElementById('registroForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const usuario = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            fechaNacimiento: document.getElementById('fechaNacimiento').value,
            telefono: document.getElementById('telefono').value,
            direccion: document.getElementById('direccion').value
        };
        
        fetch('/api/usuarios/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Error en el registro');
        })
        .then(data => {
            alert('Registro exitoso!');
            document.getElementById('registroForm').reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error en el registro: ' + error.message);
        });
    });
    
    // Manejar solicitud de consulta
    document.getElementById('consultaForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const consulta = {
            pacienteEmail: document.getElementById('pacienteEmail').value,
            doctorId: document.getElementById('doctor').value,
            fechaConsulta: document.getElementById('fechaConsulta').value,
            motivo: document.getElementById('motivo').value
        };
        
        fetch('/api/consultas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(consulta)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Error al solicitar consulta');
        })
        .then(data => {
            alert('Consulta solicitada con éxito!');
            document.getElementById('consultaForm').reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al solicitar consulta: ' + error.message);
        });
    });
    
    // Manejar seguimiento de tratamiento
    document.getElementById('seguimientoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const seguimiento = {
            tratamientoId: document.getElementById('tratamientoId').value,
            observaciones: document.getElementById('observaciones').value,
            efectividad: document.getElementById('efectividad').value
        };
        
        fetch('/api/seguimiento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(seguimiento)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Error al registrar seguimiento');
        })
        .then(data => {
            alert('Seguimiento registrado con éxito!');
            document.getElementById('seguimientoForm').reset();
            cargarTratamientos();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al registrar seguimiento: ' + error.message);
        });
    });
    
    // Cargar lista de doctores
    function cargarDoctores() {
        fetch('/api/doctores')
            .then(response => response.json())
            .then(doctores => {
                const select = document.getElementById('doctor');
                doctores.forEach(doctor => {
                    const option = document.createElement('option');
                    option.value = doctor.id;
                    option.textContent = `${doctor.nombre} - ${doctor.especialidad}`;
                    select.appendChild(option);
                });
            });
    }
    
    // Cargar tratamientos del paciente
    function cargarTratamientos() {
        const email = prompt('Ingrese su email para ver sus tratamientos:');
        if (!email) return;
        
        fetch(`/api/tratamientos?email=${email}`)
            .then(response => response.json())
            .then(tratamientos => {
                const lista = document.getElementById('listaTratamientos');
                lista.innerHTML = '';
                
                tratamientos.forEach(tratamiento => {
                    const item = document.createElement('button');
                    item.type = 'button';
                    item.className = 'list-group-item list-group-item-action';
                    item.textContent = `${tratamiento.nombre} - ${tratamiento.estado}`;
                    item.onclick = () => {
                        document.getElementById('tratamientoId').value = tratamiento.id;
                    };
                    lista.appendChild(item);
                });
            });
    }
	
	function validarRegistro(usuario) {
    const errores = {};
    
    if (!usuario.nombre || usuario.nombre.length < 3) {
        errores.nombre = "El nombre debe tener al menos 3 caracteres";
    }
    
    if (!usuario.email || !/^\S+@\S+\.\S+$/.test(usuario.email)) {
        errores.email = "Ingrese un email válido";
    }
    
    if (!usuario.password || usuario.password.length < 6) {
        errores.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    return Object.keys(errores).length === 0 ? null : errores;
}

// Modificar el submit del formulario de registro
document.getElementById('registroForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const usuario = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value
    };
    
    // Validación frontend
    const errores = validarRegistro(usuario);
    if (errores) {
        mostrarErrores(errores);
        return;
    }
    
    fetch('/api/usuarios/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        alert('Registro exitoso!');
        document.getElementById('registroForm').reset();
        limpiarErrores();
    })
    .catch(error => {
        if (typeof error === 'object') {
            mostrarErrores(error);
        } else {
            alert('Error en el registro: ' + error);
        }
    });
});

// Funciones auxiliares para mostrar errores
function mostrarErrores(errores) {
    limpiarErrores();
    Object.keys(errores).forEach(campo => {
        const input = document.getElementById(campo);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = errores[campo];
        input.classList.add('is-invalid');
        input.parentNode.appendChild(errorDiv);
    });
}

function limpiarErrores() {
    document.querySelectorAll('.is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
    });
    document.querySelectorAll('.invalid-feedback').forEach(el => {
        el.remove();
    });
}
Validación en formulario de consulta (app.js)
javascript
function validarConsulta(consulta) {
    const errores = {};
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (!consulta.pacienteEmail || !/^\S+@\S+\.\S+$/.test(consulta.pacienteEmail)) {
        errores.pacienteEmail = "Ingrese un email válido";
    }
    
    if (!consulta.doctorId) {
        errores.doctor = "Seleccione un doctor";
    }
    
    if (!consulta.fechaConsulta) {
        errores.fechaConsulta = "Seleccione una fecha y hora";
    } else {
        const fechaConsulta = new Date(consulta.fechaConsulta);
        const fechaConsultaDia = new Date(fechaConsulta);
        fechaConsultaDia.setHours(0, 0, 0, 0);
        
        if (fechaConsultaDia.getTime() === hoy.getTime()) {
            errores.fechaConsulta = "No se pueden agendar consultas para el mismo día";
        } else if (fechaConsultaDia < hoy) {
            errores.fechaConsulta = "No se pueden agendar consultas en fechas pasadas";
        } else if (fechaConsulta.getHours() < 8 || fechaConsulta.getHours() > 18) {
            errores.fechaConsulta = "El horario de atención es de 8:00 a 18:00";
        }
    }
    
    if (!consulta.motivo || consulta.motivo.length < 10) {
        errores.motivo = "Describa el motivo con al menos 10 caracteres";
    }
    
    return Object.keys(errores).length === 0 ? null : errores;
}

// Modificar el submit del formulario de consulta
document.getElementById('consultaForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const consulta = {
        pacienteEmail: document.getElementById('pacienteEmail').value,
        doctorId: document.getElementById('doctor').value,
        fechaConsulta: document.getElementById('fechaConsulta').value,
        motivo: document.getElementById('motivo').value
    };
    
    // Validación frontend
    const errores = validarConsulta(consulta);
    if (errores) {
        mostrarErroresConsulta(errores);
        return;
    }
    
    fetch('/api/consultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consulta)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        alert('Consulta solicitada con éxito!');
        document.getElementById('consultaForm').reset();
        limpiarErroresConsulta();
    })
    .catch(error => {
        if (typeof error === 'object') {
            mostrarErroresConsulta(error);
        } else {
            alert('Error al solicitar consulta: ' + error);
        }
    });
});

// Funciones auxiliares para mostrar errores en consulta
function mostrarErroresConsulta(errores) {
    limpiarErroresConsulta();
    Object.keys(errores).forEach(campo => {
        const input = document.getElementById(campo);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = errores[campo];
        input.classList.add('is-invalid');
        input.parentNode.appendChild(errorDiv);
    });
}

function limpiarErroresConsulta() {
    const campos = ['pacienteEmail', 'doctor', 'fechaConsulta', 'motivo'];
    campos.forEach(campo => {
        const input = document.getElementById(campo);
        if (input) {
            input.classList.remove('is-invalid');
            const feedback = input.parentNode.querySelector('.invalid-feedback');
            if (feedback) feedback.remove();
        }
    });
}

});