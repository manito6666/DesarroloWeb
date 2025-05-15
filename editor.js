// Verificamos que el usuario esté autenticado y cargamos la nota si existe
document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = 'Homme.html'; // Si no hay token al login
        return;
    }

    const noteId = sessionStorage.getItem('noteId');
    if (noteId) {
        cargarNota(noteId, token); // Si hay una nota guardada, la cargamos
    } else {
        sessionStorage.removeItem('noteId'); // Si no hay nota que este limpia
    }

    document.getElementById('btnSave').onclick = guardarNota; // Guardamos la nota
});

// Cargar una nota directamente del servidor
function cargarNota(id, token) {
    fetch(`http://localhost:3000/note/${id}`, {
        headers: { 'Authorization': token } // Enviamos el token para verificar
    })
        .then(res => res.json()) // Convertimos la respuesta en JSON
        .then(note => {
            if (note.contenido) {
                document.getElementById('editor').innerHTML = note.contenido; // Mostramos la nota
            } else {
                alert("No se pudo cargar la nota."); // Si falla
            }
        })
        .catch(() => alert("Error al cargar la nota.")); // Error general
}

// Guardar nota (nueva o editar)
function guardarNota() {
    const token = sessionStorage.getItem('token');
    const contenido = document.getElementById('editor').innerHTML.trim(); // Tomamos el contenido del editor
    if (!contenido) return alert("No puedes guardar una nota vacía."); // Si está vacío, no guardamos

    const noteId = sessionStorage.getItem('noteId');
    const url = noteId ? `http://localhost:3000/note/${noteId}` : 'http://localhost:3000/note'; // URL según si es nueva o editar
    const method = noteId ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ contenido }) // Mandamos el contenido como JSON
    })
        .then(res => {
            if (res.ok) {
                sessionStorage.removeItem('noteId'); // Limpiamos el ID después de guardar
                window.location.href = 'notes.html'; // Redirigimos si todo salió bien
            } else {
                alert("Error al guardar la nota.");
            }
        })
        .catch(() => alert("Error al guardar la nota.")); // Error general
}
