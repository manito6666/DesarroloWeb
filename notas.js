// Al cargar la página, mostramos las notas del usuario
document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = 'Homme.html';
        return;
    }

    // Pedimos las notas del usuario
    fetch('http://localhost:3000/notes', {
        headers: { 'Authorization': token }
    })
        .then(res => res.json())
        .then(notes => {
            const container = document.getElementById('notasContainer');
            container.innerHTML = ""; // Limpiamos el contenedor

            // Mostramos cada nota
            for (let i = 0; i < notes.length; i++) {
                const noteDiv = document.createElement('div');
                noteDiv.classList.add('card', 'mb-3');
                noteDiv.innerHTML = `
                <div class="note-body">${notes[i].contenido}</div>
                <div class="card-body text-end">
                    <button class="btn btn-primary btn-sm" onclick="editarNota('${notes[i]._id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarNota('${notes[i]._id}')">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            `;
                container.appendChild(noteDiv); // Metemos la nota en el contenedor
            }
        })
        .catch(() => {
            alert("Error al cargar las notas."); // Mostramos mensaje si falla
        });
});

// Editar nota (guarda el ID y va al editor)
function editarNota(id) {
    sessionStorage.setItem('noteId', id);
    window.location.href = 'editor.html'; // Nos lleva al editor
}

// Eliminar nota
function eliminarNota(id) {
    if (!confirm("¿Eliminar esta nota?")) return;

    const token = sessionStorage.getItem('token');
    fetch(`http://localhost:3000/note/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': token }
    })
        .then(res => {
            if (res.ok) {
                location.reload(); // Si se borra, recargamos
            } else {
                alert("Error al eliminar la nota."); // Mensaje si falla
            }
        })
        .catch(() => {
            alert("Error al eliminar la nota.");
        });
}

// Cerrar sesión limpia todo
function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = 'Homme.html';
}
