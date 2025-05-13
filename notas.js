document.addEventListener('DOMContentLoaded', async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        alert("Error: No se encontró el usuario. Por favor, inicia sesión.");
        window.location.href = 'Homme.html';
        return;
    }

    const response = await fetch(`http://localhost:3000/notes/${userId}`);
    const notes = await response.json();
    const notasContainer = document.getElementById('notasContainer');

    if (notes.length === 0) {
        notasContainer.innerHTML = '<p>No tienes notas guardadas.</p>';
    } else {
        notasContainer.innerHTML = notes.map(note => `
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Tu Nota</div>
                    <div class="note-body">
                        <p id="note-${note._id}">${note.contenido}</p>
                    </div>
                    <div class="card-body text-end">
                        <button class="btn-edit" onclick="editarNota('${note._id}')">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-delete" onclick="eliminarNota('${note._id}')">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
});

// Función para eliminar una nota
async function eliminarNota(noteId) {
    if (confirm("¿Estás seguro de eliminar esta nota?")) {
        const response = await fetch(`http://localhost:3000/note/${noteId}`, {
            method: 'DELETE'
        });
        if (response.ok) location.reload();
        else alert("Error al eliminar la nota.");
    }
}

//  Función para editar una nota
function editarNota(noteId) {
    const noteContent = document.getElementById(`note-${noteId}`).innerHTML;
    sessionStorage.setItem('noteId', noteId);
    sessionStorage.setItem('noteContent', noteContent);
    window.location.href = 'editor.html';
}
