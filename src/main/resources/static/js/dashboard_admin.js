// ==========================================
// DASHBOARD ADMIN - FUNCIONES ESPECÍFICAS
// ==========================================

// AL CARGAR LA PAGINA
document.addEventListener("DOMContentLoaded", init);

async function init() {
    await mostrarCursos();
    await mostrarAlumnos();
    await cargarCursosEnSelects();
    configurarValidacionParalelo();
}

// ==========================================
// VALIDACIÓN DE PARALELO
// ==========================================
function configurarValidacionParalelo() {
    const inputParalelo = document.getElementById('paraleloCurso');
    
    inputParalelo.addEventListener('input', function(e) {
        // Eliminar cualquier carácter que no sea una letra
        let valor = e.target.value.replace(/[^A-Za-z]/g, '');
        // Tomar solo el primer carácter
        e.target.value = valor.substring(0, 1).toUpperCase();
    });
    
    inputParalelo.addEventListener('keypress', function(e) {
        // Prevenir entrada de números y caracteres especiales
        const char = String.fromCharCode(e.which);
        if (!/[A-Za-z]/.test(char)) {
            e.preventDefault();
        }
    });
}

// ==========================================
// MODALES - CURSO (Solo Admin)
// ==========================================
function abrirModalCurso(id = null, nombre = '', paralelo = '') {
    document.getElementById('modalCurso').style.display = 'block';
    document.getElementById('idCursoHidden').value = id || '';
    document.getElementById('nombreCurso').value = nombre;
    document.getElementById('paraleloCurso').value = paralelo;
    document.getElementById('tituloModalCurso').textContent = id ? 'Editar Curso' : 'Nuevo Curso';
}

function cerrarModalCurso() {
    document.getElementById('modalCurso').style.display = 'none';
    document.getElementById('formCurso').reset();
}

// ==========================================
// LÓGICA DE CURSOS
// ==========================================
function renderizarTablaCursos(listaCursos) {
    const tabla = document.getElementById("tblCursos");
    tabla.innerHTML = "";

    listaCursos.forEach(c => {
        tabla.innerHTML += `
            <tr>
                <td>${c.idCurso}</td>
                <td>${c.nombreCurso}</td>
                <td>${c.paralelo || '-'}</td>
                <td>
                    <button class="btn-warning" onclick="abrirModalCurso(${c.idCurso}, '${c.nombreCurso}', '${c.paralelo}')">✏️ Editar</button>
                    <button class="btn-danger" onclick="eliminarCurso(${c.idCurso})">🗑️ Eliminar</button>
                </td>
            </tr>`;
    });
}

async function mostrarCursos() {
    try {
        const response = await fetch(API_CURSOS);
        const cursos = await response.json();
        renderizarTablaCursos(cursos);
    } catch (error) {
        console.error("Error al cargar cursos:", error);
        alert("Error al cargar cursos");
    }
}

async function guardarCurso() {
    const id = document.getElementById("idCursoHidden").value;
    const nombre = document.getElementById("nombreCurso").value;
    const paralelo = document.getElementById("paraleloCurso").value;

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_CURSOS}/${id}` : API_CURSOS;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombreCurso: nombre, paralelo: paralelo })
        });

        if (response.ok) {
            cerrarModalCurso();
            await mostrarCursos();
            await cargarCursosEnSelects();
            alert(id ? "Curso actualizado correctamente" : "Curso creado correctamente");
        } else {
            const error = await response.json();
            alert(`Error: ${error.message || 'No se pudo guardar el curso'}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor");
    }
}

async function eliminarCurso(id) {
    if (!confirm("¿Está seguro de eliminar este curso?")) return;
    
    try {
        const response = await fetch(`${API_CURSOS}/${id}`, { method: "DELETE" });
        if (response.ok) {
            await mostrarCursos();
            await cargarCursosEnSelects();
            alert("Curso eliminado correctamente");
        } else {
            const error = await response.json();
            alert(`Error: ${error.message || 'No se pudo eliminar el curso'}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor");
    }
}

async function cargarCursosEnSelects() {
    try {
        const response = await fetch(API_CURSOS);
        const cursos = await response.json();

        const select1 = document.getElementById("selectCursoAlumno");
        const select2 = document.getElementById("filtroCursoId");
        
        select1.innerHTML = '<option value="">-- Seleccione un Curso --</option>';
        select2.innerHTML = '<option value="">Seleccione un curso</option>';

        cursos.forEach(c => {
            select1.innerHTML += `<option value="${c.idCurso}">${c.nombreCurso} (${c.paralelo})</option>`;
            select2.innerHTML += `<option value="${c.idCurso}">${c.nombreCurso} (${c.paralelo})</option>`;
        });
    } catch (error) {
        console.error("Error al cargar cursos:", error);
    }
}
