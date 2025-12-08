// ==========================================
// FUNCIONES COMUNES PARA AMBOS DASHBOARDS
// ==========================================

// URLS API
const API_ALUMNOS = "/api/alumnos";
const API_CURSOS = "/api/cursos";

let modoEdicion = false;
let cedulaEdicion = null;

// ==========================================
// VALIDACIONES EN TIEMPO REAL
// ==========================================
function configurarValidacionesAlumno() {
    // Validación de Cédula: solo números, exactamente 10
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
    
    // Validación de Teléfono: solo números, exactamente 10
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
    
    // Validación de Nombre: solo letras y espacios, mínimo 3
    const inputNombre = document.getElementById('nombre');
    if (inputNombre) {
        inputNombre.addEventListener('input', function(e) {
            // Permitir letras (incluye acentos), espacios y ñ
            e.target.value = e.target.value.replace(/[^A-Za-záéíóúÁÉÍÓÚñÑ ]/g, '');
        });
        inputNombre.addEventListener('keypress', function(e) {
            const char = String.fromCharCode(e.which);
            if (!/[A-Za-záéíóúÁÉÍÓÚñÑ ]/.test(char)) {
                e.preventDefault();
            }
        });
    }
    
    // Validación de Apellido: solo letras y espacios, mínimo 3
    const inputApellido = document.getElementById('apellido');
    if (inputApellido) {
        inputApellido.addEventListener('input', function(e) {
            // Permitir letras (incluye acentos), espacios y ñ
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

// ==========================================
// MODALES - ALUMNO
// ==========================================
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
    
    // Configurar validaciones cada vez que se abre el modal
    configurarValidacionesAlumno();
}

function cerrarModalAlumno() {
    document.getElementById('modalAlumno').style.display = 'none';
    document.getElementById('formAlumno').reset();
    modoEdicion = false;
    cedulaEdicion = null;
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modalAlumno = document.getElementById('modalAlumno');
    const modalCurso = document.getElementById('modalCurso');
    if (event.target == modalAlumno) cerrarModalAlumno();
    if (modalCurso && event.target == modalCurso) cerrarModalCurso();
}

// ==========================================
// LÓGICA DE ALUMNOS - COMÚN
// ==========================================
async function mostrarAlumnos() {
    try {
        const response = await fetch(API_ALUMNOS);
        const alumnos = await response.json();
        renderizarTablaAlumnos(alumnos);
    } catch (error) {
        console.error("Error al cargar alumnos:", error);
        alert("Error al cargar alumnos");
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
        alert("Error al cargar datos del alumno");
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
        alert("Por favor seleccione un curso");
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
            alert(modoEdicion ? "Alumno actualizado correctamente" : "Alumno creado correctamente");
        } else {
            const error = await response.json();
            alert(`Error: ${error.message || 'No se pudo guardar el alumno'}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor");
    }
}

async function eliminarAlumno(cedula) {
    if (!confirm(`¿Está seguro de eliminar al alumno con cédula ${cedula}?`)) return;

    try {
        const response = await fetch(`${API_ALUMNOS}/${cedula}`, { method: "DELETE" });
        if (response.ok) {
            await mostrarAlumnos();
            alert("Alumno eliminado correctamente");
        } else {
            alert("Error al eliminar el alumno");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor");
    }
}

// ==========================================
// FILTROS - COMUNES
// ==========================================

// Filtro 1: Buscar alumno por cédula
async function buscarAlumnoPorCedula() {
    const cedula = document.getElementById("filtroCedula").value.trim();
    if (!cedula) {
        alert("Por favor ingrese una cédula");
        return;
    }

    try {
        const response = await fetch(`${API_ALUMNOS}/${cedula}`);
        if (response.ok) {
            const alumno = await response.json();
            renderizarTablaAlumnos([alumno]);
        } else {
            alert("Alumno no encontrado");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al buscar el alumno");
    }
}

// Filtro 2: Ver curso de un alumno
async function verCursoDeAlumno() {
    const cedula = document.getElementById("filtroCursoCedula").value.trim();
    
    if (!cedula) {
        alert("Por favor ingrese una cédula");
        return;
    }

    try {
        const response = await fetch(`${API_ALUMNOS}/${cedula}/curso`);
        if (response.ok) {
            const curso = await response.json();
            // Filtrar la tabla para mostrar solo este curso
            renderizarTablaCursos([curso]);
        } else {
            alert("No se encontró el curso del alumno");
            // Mostrar tabla vacía
            document.getElementById("tblCursos").innerHTML = "";
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al obtener el curso del alumno");
    }
}

// Filtro 3: Alumnos por curso
async function listarAlumnosPorCurso() {
    const idCurso = document.getElementById("filtroCursoId").value;
    if (!idCurso) {
        alert("Por favor seleccione un curso");
        return;
    }

    try {
        const response = await fetch(`${API_ALUMNOS}/por-curso/${idCurso}`);
        if (response.ok) {
            const alumnos = await response.json();
            renderizarTablaAlumnos(alumnos);
        } else {
            alert("Error al obtener alumnos del curso");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al aplicar filtro");
    }
}

function limpiarFiltros() {
    document.getElementById("filtroCedula").value = "";
    document.getElementById("filtroCursoCedula").value = "";
    document.getElementById("filtroCursoId").value = "";
    // Recargar todas las tablas
    mostrarAlumnos();
    if (typeof mostrarCursos === 'function') {
        mostrarCursos();
    }
}
