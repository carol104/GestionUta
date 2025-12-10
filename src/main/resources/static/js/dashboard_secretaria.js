document.addEventListener("DOMContentLoaded", init);

async function init() {
    await cargarCursosEnSelect();
    await mostrarAlumnos();
}

async function cargarCursosEnSelect() {
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
        mostrarNotificacion("No se pudieron cargar los cursos. Por favor, intente nuevamente.", "error");
    }
}
