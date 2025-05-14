// ✅ notas.js (Súper Simplificado con Cerrar Sesión)
document.addEventListener('DOMContentLoaded', async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        alert("Inicia sesión.");
        window.location.href = 'Homme.html';
        return;
    }

    const response = await fetch('http://localhost:3000/notes', {
        headers: { 'Authorization': token }
    });
    const notes = await response.json();
    const container = document.getElementById('notasContainer');

    if (notes.length === 0) {
        container.innerHTML = '<p>No tienes notas guardadas.</p>';
    } else {
        container.innerHTML = notes.map(note => `
            <div class="col-md-6">
                <div class="card">
                    <div class="note-body">${note.contenido}</div>
                    <div class="card-body text-end">
                        <button class="btn-edit" onclick="editarNota('${note._id}', '${note.contenido}')">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-delete" onclick="eliminarNota('${note._id}', '${token}')">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
});

// ✅ Función para cerrar sesión (Botón Inicio)
async function cerrarSesion() {
    await fetch('http://localhost:3000/logout', {
        method: 'POST'
    });
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    window.location.href = 'Homme.html';
}

// ✅ Función para editar nota
function editarNota(id, contenido) {
    sessionStorage.setItem('noteId', id);
    sessionStorage.setItem('noteContent', contenido);
    window.location.href = 'editor.html';
}

// ✅ Función para eliminar nota
async function eliminarNota(id, token) {
    if (confirm("¿Eliminar esta nota?")) {
        await fetch(`http://localhost:3000/note/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        });
        location.reload();
    }
}
