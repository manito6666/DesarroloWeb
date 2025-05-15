// Cargar usuarios al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    const token = sessionStorage.getItem('token');
    if (!token) return window.location.href = 'Homme.html';

    const res = await fetch('http://localhost:3000/users', {
        headers: { Authorization: token }
    });

    const users = await res.json();
    const lista = document.querySelector('.list-group');
    lista.innerHTML = '';

    users.forEach(user => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            ${user.nombre} (${user.correo})
            <button class="btn btn-danger btn-sm" onclick="eliminarUsuario('${user._id}')">Eliminar</button>
        `;
        lista.appendChild(li);
    });
});

// Eliminar usuario y sus notas
async function eliminarUsuario(id) {
    if (!confirm("¿Eliminar este usuario y sus notas?")) return;
    const token = sessionStorage.getItem('token');
    await fetch(`http://localhost:3000/user/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token }
    });
    location.reload();
}

// Cerrar sesión
function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = 'Homme.html';
}
