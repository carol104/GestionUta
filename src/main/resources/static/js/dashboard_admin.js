
document.addEventListener("DOMContentLoaded", init);

async function init() {
    await mostrarCursos();
    await mostrarAlumnos();
    await cargarCursosEnSelects();
    configurarValidacionParalelo();
}


function configurarValidacionParalelo() {
    const inputParalelo = document.getElementById('paraleloCurso');
    
    inputParalelo.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/[^A-Za-z]/g, '');
        e.target.value = valor.substring(0, 1).toUpperCase();
    });
    
    inputParalelo.addEventListener('keypress', function(e) {
        const char = String.fromCharCode(e.which);
        if (!/[A-Za-z]/.test(char)) {
            e.preventDefault();
        }
    });
}


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
        mostrarNotificacion("No se pudieron cargar los cursos. Por favor, intente nuevamente.", "error");
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
            await  mostrarAlumnos();
            mostrarNotificacion(
                id ? "El curso se actualizó correctamente." : "El curso se creó exitosamente.",
                "success"
            );
        } else {
            const error = await response.json();
            mostrarNotificacion(error.message || 'No se pudo guardar el curso. Verifique los datos e intente nuevamente.', "error");
        }
    } catch (error) {
        console.error("Error:", error);
        mostrarNotificacion("No se pudo conectar con el servidor. Verifique su conexión.", "error");
    }
}

async function eliminarCurso(id) {
    const confirmar = await mostrarConfirmacion(
        '¿Está seguro de eliminar este curso?\n\nTodos los alumnos asociados quedarán sin curso.\nEsta acción no se puede deshacer.',
        'Confirmar eliminación'
    );
    
    if (!confirmar) return;
    
    try {
        const response = await fetch(`${API_CURSOS}/${id}`, { method: "DELETE" });
        if (response.ok) {
            await mostrarCursos();
            await cargarCursosEnSelects();
            mostrarNotificacion("El curso se eliminó correctamente.", "success");
        } else {
            const error = await response.json();
            mostrarNotificacion(error.message || 'No se pudo eliminar el curso. Intente nuevamente.', "error");
        }
    } catch (error) {
        console.error("Error:", error);
        mostrarNotificacion("No se pudo conectar con el servidor.", "error");
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
