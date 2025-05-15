// Verificar autenticación y cargar nota directamente
document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    if (!token) return window.location.href = 'Homme.html';

    const noteId = sessionStorage.getItem('noteId');
    if (noteId) cargarNota(noteId, token);

    document.getElementById('btnSave').onclick = guardarNota;
});

// Cargar nota directamente desde la base de datos
async function cargarNota(id, token) {
    try {
        const res = await fetch(`http://localhost:3000/note/${id}`, {
            headers: { 'Authorization': token }
        });

        if (res.ok) {
            const note = await res.json();
            document.getElementById('editor').innerHTML = note.contenido;
        } else {
            alert("No se pudo cargar la nota.");
        }
    } catch {
        alert("Error al cargar la nota.");
    }
}

// Guardar nota (nueva o editar)
async function guardarNota() {
    const token = sessionStorage.getItem('token');
    const contenido = document.getElementById('editor').innerHTML.trim();
    if (!contenido) return alert("No puedes guardar una nota vacía.");

    const noteId = sessionStorage.getItem('noteId');
    const url = noteId ? `http://localhost:3000/note/${noteId}` : 'http://localhost:3000/note';
    const method = noteId ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({ contenido })
    });

    if (res.ok) {
        sessionStorage.removeItem('noteId');
        window.location.href = 'notes.html';
    } else {
        alert("Error al guardar la nota.");
    }
}
