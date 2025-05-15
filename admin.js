// Cargar usuarios al iniciar
document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token'); // Obtenemos el token del usuario
    if (!token) {
        window.location.href = 'Homme.html'; // Si no está logueado, lo mandamos al login
        return;
    }

    // Pedimos la lista de usuarios al servidor
    fetch('http://localhost:3000/users', {
        headers: { Authorization: token }
    })
        .then(res => res.json()) // Convertimos la respuesta en JSON
        .then(users => {
            const lista = document.querySelector('.list-group'); // Seleccionamos la lista de usuarios
            lista.innerHTML = ''; // Limpiamos la lista

            // Recorremos y mostramos cada usuario
            users.forEach(user => {
                const li = document.createElement('li'); // Creamos un elemento de lista
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                ${user.nombre} (${user.correo}) 
                <button class="btn btn-danger btn-sm" onclick="eliminarUsuario('${user._id}')">Eliminar</button>
            `;
                lista.appendChild(li); // Agregamos el usuario a la lista
            });
        })
        .catch(() => alert("Error al cargar usuarios.")); // Si algo falla
});

// Eliminar usuario y sus notas
function eliminarUsuario(id) {
    if (!confirm("¿Eliminar este usuario y sus notas?")) return; // Preguntamos si está seguro

    const token = sessionStorage.getItem('token');
    fetch(`http://localhost:3000/user/${id}`, {
        method: 'DELETE', // Enviamos la petición para eliminar
        headers: { Authorization: token }
    })
        .then(() => location.reload()) // Recargamos para actualizar
        .catch(() => alert("Error al eliminar usuario.")); // Si algo falla
}

// Cerrar sesión
function cerrarSesion() {
    sessionStorage.clear(); // Limpiamos todo (
    window.location.href = 'Homme.html'; // nos vamos Home
}
