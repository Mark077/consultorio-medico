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