// Cargar notas del usuario al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    const token = sessionStorage.getItem('token');
    if (!token) return window.location.href = 'Homme.html';

    try {
        const res = await fetch('http://localhost:3000/notes', {
            headers: { 'Authorization': token }
        });

        const notes = await res.json();
        const container = document.getElementById('notasContainer');
        container.innerHTML = "";

        notes.forEach(note => {
            const noteDiv = document.createElement('div');
            noteDiv.classList.add('card', 'mb-3');
            noteDiv.innerHTML = `
                <div class="note-body">${note.contenido}</div>
                <div class="card-body text-end">
                    <button class="btn btn-primary btn-sm" onclick="editarNota('${note._id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarNota('${note._id}')">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            `;
            container.appendChild(noteDiv);
        });
    } catch (error) {
        console.error("Error al cargar las notas:", error);
        alert("Error al cargar las notas.");
    }
});

// Editar nota (redirige al editor)
function editarNota(id) {
    sessionStorage.setItem('noteId', id);
    window.location.href = 'editor.html';
}

// Eliminar nota
async function eliminarNota(id) {
    if (!confirm("¿Eliminar esta nota?")) return;
    const token = sessionStorage.getItem('token');

    try {
        const res = await fetch(`http://localhost:3000/note/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        });

        if (res.ok) {
            location.reload();
        } else {
            alert("Error al eliminar la nota.");
        }
    } catch (error) {
        console.error("Error al eliminar la nota:", error);
        alert("Error al eliminar la nota.");
    }
}

// Cerrar sesión
function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = 'Homme.html';
}
