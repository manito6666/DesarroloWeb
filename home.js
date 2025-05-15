// Registro de nuevo usuario
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contrasena })
    });

    const data = await res.json();
    if (res.ok) {
        sessionStorage.setItem('token', data.token);
        window.location.href = 'editor.html';
    } else {
        alert(data.message);
    }
});

// Inicio de sesión
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const correo = document.getElementById('loginCorreo').value;
    const contrasena = document.getElementById('loginContrasena').value;

    const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
    });

    const data = await res.json();
    if (res.ok) {
        sessionStorage.setItem('token', data.token);
        window.location.href = correo === 'admin@gmail.com' ? 'admin.html' : 'editor.html';
    } else {
        alert("Credenciales incorrectas.");
    }
});
