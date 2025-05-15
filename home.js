// Registro de nuevo usuario
// Aquí detectamos cuando el usuario envía el formulario de registro
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Evitamos que se recargue la página

    // Obtenemos los datos del formulario
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    // Enviamos los datos al servidor para registrar
    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contrasena })
    })
        .then(res => res.json()) // Convertimos la respuesta en JSON
        .then(data => {
            if (data.token) { // Si el registro fue exitoso
                sessionStorage.setItem('token', data.token); // Guardamos el token
                window.location.href = 'editor.html'; // Enviamos al editor
            } else {
                alert(data.message); // Si hay error, mostramos el mensaje
            }
        })
        .catch(() => alert('Error al registrar.')); // Si algo falla, mostramos un mensaje
});

// Inicio de sesión
// Aquí detectamos cuando el usuario envía el formulario de login
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Evitamos que se recargue la página

    // Obtenemos los datos del formulario
    const correo = document.getElementById('loginCorreo').value;
    const contrasena = document.getElementById('loginContrasena').value;

    // Enviamos los datos al servidor para iniciar sesión
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
    })
        .then(res => res.json()) // Convertimos la respuesta en JSON
        .then(data => {
            if (data.token) { // Si el login fue exitoso
                sessionStorage.setItem('token', data.token); // Guardamos el token
                // Si es admin, va al admin, si no, al editor
                window.location.href = correo === 'admin@gmail.com' ? 'admin.html' : 'editor.html';
            } else {
                alert('Credenciales incorrectas.'); // Si las credenciales son incorrectas
            }
        })
        .catch(() => alert('Error al iniciar sesión.')); // Si algo falla, mostramos un mensaje
});
