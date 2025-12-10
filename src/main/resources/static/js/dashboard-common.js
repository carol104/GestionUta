
const API_ALUMNOS = "/api/alumnos";
const API_CURSOS = "/api/cursos";

let modoEdicion = false;
let cedulaEdicion = null;
let modalCallback = null;

function mostrarNotificacion(mensaje, tipo = 'info', titulo = '') {
    const modal = document.getElementById('notificationModal');
    const icon = document.getElementById('modalIcon');
    const titleElement = document.getElementById('modalTitle');
    const messageElement = document.getElementById('modalMessage');
    const btnCancel = document.getElementById('modalBtnCancel');
    const btnAccept = document.getElementById('modalBtnAccept');
    
    const configuraciones = {
        success: { icono: '✓', titulo: titulo || 'Éxito' },
        error: { icono: '✕', titulo: titulo || 'Error' },
        warning: { icono: '⚠', titulo: titulo || 'Advertencia' },
        info: { icono: 'ℹ', titulo: titulo || 'Información' }
    };
    
    const config = configuraciones[tipo] || configuraciones.info;
    
    icon.className = 'modal-icon';
    icon.classList.add(tipo);
    icon.textContent = config.icono;
    
    titleElement.textContent = config.titulo;
    messageElement.textContent = mensaje;
    
    btnCancel.style.display = 'none';
    btnAccept.textContent = 'Aceptar';
    
    modal.classList.add('show');
    
    modalCallback = null;
}

function mostrarConfirmacion(mensaje, titulo = 'Confirmar acción') {
    return new Promise((resolve) => {
        const modal = document.getElementById('notificationModal');
        const icon = document.getElementById('modalIcon');
        const titleElement = document.getElementById('modalTitle');
        const messageElement = document.getElementById('modalMessage');
        const btnCancel = document.getElementById('modalBtnCancel');
        const btnAccept = document.getElementById('modalBtnAccept');
        
        icon.className = 'modal-icon warning';
        icon.textContent = '?';
        
        titleElement.textContent = titulo;
        messageElement.textContent = mensaje;
        
        btnCancel.style.display = 'inline-block';
        btnAccept.textContent = 'Confirmar';
        
        modalCallback = resolve;
        
        modal.classList.add('show');
    });
}

function cerrarModalNotificacion(resultado = true) {
    const modal = document.getElementById('notificationModal');
    modal.classList.remove('show');
    
    if (modalCallback) {
        modalCallback(resultado);
        modalCallback = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('notificationModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal && !modalCallback) {
                cerrarModalNotificacion();
            }
        });
    }
});


function configurarValidacionesAlumno() {
    const inputCedula = document.getElementById('cedula');
    if (inputCedula) {
        inputCedula.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 10);
        });
        inputCedula.addEventListener('keypress', function(e) {
            if (!/[0-9]/.test(String.fromCharCode(e.which))) {
                e.preventDefault();
            }
        });
    }
    
    const inputTelefono = document.getElementById('telefono');
    if (inputTelefono) {
        inputTelefono.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 10);
        });
        inputTelefono.addEventListener('keypress', function(e) {
            if (!/[0-9]/.test(String.fromCharCode(e.which))) {
                e.preventDefault();
            }
        });
    }
    
    const inputNombre = document.getElementById('nombre');
    if (inputNombre) {
        inputNombre.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^A-Za-záéíóúÁÉÍÓÚñÑ ]/g, '');
        });
        inputNombre.addEventListener('keypress', function(e) {
            const char = String.fromCharCode(e.which);
            if (!/[A-Za-záéíóúÁÉÍÓÚñÑ ]/.test(char)) {
                e.preventDefault();
            }
        });
    }
    
    const inputApellido = document.getElementById('apellido');
    if (inputApellido) {
        inputApellido.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^A-Za-záéíóúÁÉÍÓÚñÑ ]/g, '');
        });
        inputApellido.addEventListener('keypress', function(e) {
            const char = String.fromCharCode(e.which);
            if (!/[A-Za-záéíóúÁÉÍÓÚñÑ ]/.test(char)) {
                e.preventDefault();
            }
        });
    }
}


function abrirModalAlumno(cedula = null) {
    document.getElementById('modalAlumno').style.display = 'block';
    document.getElementById('tituloModalAlumno').textContent = cedula ? 'Editar Alumno' : 'Nuevo Alumno';
    
    if (cedula) {
        modoEdicion = true;
        cedulaEdicion = cedula;
        cargarDatosAlumno(cedula);
        document.getElementById('cedula').disabled = true;
    } else {
        modoEdicion = false;
        cedulaEdicion = null;
        document.getElementById('cedula').disabled = false;
        document.getElementById('formAlumno').reset();
    }
    
    configurarValidacionesAlumno();
}

function cerrarModalAlumno() {
    document.getElementById('modalAlumno').style.display = 'none';
    document.getElementById('formAlumno').reset();
    modoEdicion = false;
    cedulaEdicion = null;
}

window.onclick = function(event) {
    const modalAlumno = document.getElementById('modalAlumno');
    const modalCurso = document.getElementById('modalCurso');
    if (event.target == modalAlumno) cerrarModalAlumno();
    if (modalCurso && event.target == modalCurso) cerrarModalCurso();
}


async function mostrarAlumnos() {
    try {
        const response = await fetch(API_ALUMNOS);
        const alumnos = await response.json();
        renderizarTablaAlumnos(alumnos);
    } catch (error) {
        console.error("Error al cargar alumnos:", error);
        mostrarNotificacion("No se pudieron cargar los alumnos. Por favor, intente nuevamente.", "error");
    }
}

function renderizarTablaAlumnos(lista) {
    const tabla = document.getElementById("tblAlumnos");
    tabla.innerHTML = "";

    lista.forEach(al => {
        let nombreCurso = al.curso ? `${al.curso.nombreCurso} (${al.curso.paralelo})` : "Sin Curso";

        tabla.innerHTML += `
            <tr>
                <td>${al.cedula}</td>
                <td>${al.nombre}</td>
                <td>${al.apellido}</td>
                <td>${al.direccion}</td>
                <td>${al.telefono}</td>
                <td>${nombreCurso}</td>
                <td>
                    <button class="btn-warning" onclick="abrirModalAlumno('${al.cedula}')">✏️ Editar</button>
                    <button class="btn-danger" onclick="eliminarAlumno('${al.cedula}')">🗑️ Eliminar</button>
                </td>
            </tr>`;
    });
}

async function cargarDatosAlumno(cedula) {
    try {
        const response = await fetch(`${API_ALUMNOS}/${cedula}`);
        const al = await response.json();

        document.getElementById("cedula").value = al.cedula;
        document.getElementById("nombre").value = al.nombre;
        document.getElementById("apellido").value = al.apellido;
        document.getElementById("direccion").value = al.direccion;
        document.getElementById("telefono").value = al.telefono;
        document.getElementById("selectCursoAlumno").value = al.curso ? al.curso.idCurso : "";
    } catch (error) {
        console.error("Error:", error);
        mostrarNotificacion("No se pudieron cargar los datos del alumno.", "error");
    }
}

async function guardarAlumno() {
    const cedula = document.getElementById("cedula").value;
    const data = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        direccion: document.getElementById("direccion").value,
        telefono: document.getElementById("telefono").value,
        idCurso: parseInt(document.getElementById("selectCursoAlumno").value)
    };

    if (!data.idCurso) {
        mostrarNotificacion("Por favor seleccione un curso antes de guardar.", "warning");
        return;
    }

    try {
        let response;
        if (modoEdicion) {
            response = await fetch(`${API_ALUMNOS}/${cedula}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(API_ALUMNOS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cedula, ...data })
            });
        }

        if (response.ok) {
            cerrarModalAlumno();
            await mostrarAlumnos();
            mostrarNotificacion(
                modoEdicion ? "Los datos del alumno se actualizaron correctamente." : "El alumno se registró exitosamente.",
                "success"
            );
        } else {
            const error = await response.json();
            mostrarNotificacion(error.message || 'No se pudo guardar el alumno. Verifique los datos e intente nuevamente.', "error");
        }
    } catch (error) {
        console.error("Error:", error);
        mostrarNotificacion("No se pudo conectar con el servidor. Verifique su conexión.", "error");
    }
}

async function eliminarAlumno(cedula) {
    const confirmar = await mostrarConfirmacion(
        `¿Está seguro de eliminar al alumno con cédula ${cedula}?\n\nEsta acción no se puede deshacer.`,
        'Confirmar eliminación'
    );
    
    if (!confirmar) return;

    try {
        const response = await fetch(`${API_ALUMNOS}/${cedula}`, { method: "DELETE" });
        if (response.ok) {
            await mostrarAlumnos();
            mostrarNotificacion("El alumno se eliminó correctamente.", "success");
        } else {
            mostrarNotificacion("No se pudo eliminar el alumno. Intente nuevamente.", "error");
        }
    } catch (error) {
        console.error("Error:", error);
        mostrarNotificacion("No se pudo conectar con el servidor.", "error");
    }
}


async function buscarAlumnoPorCedula() {
    const cedula = document.getElementById("filtroCedula").value.trim();
    if (!cedula) {
        mostrarNotificacion("Por favor ingrese una cédula para buscar.", "warning");
        return;
    }

    try {
        const response = await fetch(`${API_ALUMNOS}/${cedula}`);
        if (response.ok) {
            const alumno = await response.json();
            renderizarTablaAlumnos([alumno]);
        } else {
            mostrarNotificacion("No se encontró ningún alumno con esa cédula.", "info");
        }
    } catch (error) {
        console.error("Error:", error);
        mostrarNotificacion("Error al buscar el alumno.", "error");
    }
}

async function verCursoDeAlumno() {
    const cedula = document.getElementById("filtroCursoCedula").value.trim();
    
    if (!cedula) {
        mostrarNotificacion("Por favor ingrese una cédula para buscar el curso.", "warning");
        return;
    }

    try {
        const response = await fetch(`${API_ALUMNOS}/${cedula}/curso`);
        if (response.ok) {
            const curso = await response.json();
            renderizarTablaCursos([curso]);
        } else {
            mostrarNotificacion("No se encontró el curso del alumno con esa cédula.", "info");
            document.getElementById("tblCursos").innerHTML = "";
        }
    } catch (error) {
        console.error("Error:", error);
        mostrarNotificacion("Error al obtener el curso del alumno.", "error");
    }
}

async function listarAlumnosPorCurso() {
    const idCurso = document.getElementById("filtroCursoId").value;
    if (!idCurso) {
        mostrarNotificacion("Por favor seleccione un curso para ver sus alumnos.", "warning");
        return;
    }

    try {
        const response = await fetch(`${API_ALUMNOS}/por-curso/${idCurso}`);
        if (response.ok) {
            const alumnos = await response.json();
            renderizarTablaAlumnos(alumnos);
        } else {
            mostrarNotificacion("Error al obtener los alumnos del curso.", "error");
        }
    } catch (error) {
        console.error("Error:", error);
        mostrarNotificacion("Error al aplicar filtro.", "error");
    }
}

function limpiarFiltros() {
    document.getElementById("filtroCedula").value = "";
    document.getElementById("filtroCursoCedula").value = "";
    document.getElementById("filtroCursoId").value = "";
    mostrarAlumnos();
    if (typeof mostrarCursos === 'function') {
        mostrarCursos();
    }
}
