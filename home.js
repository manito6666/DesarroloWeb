// ✅ home.js (Súper Simplificado)
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellidos, correo, contrasena })
    });
    const data = await response.json();
    if (response.ok) {
        sessionStorage.setItem('token', data.token);
        window.location.href = 'editor.html';
    } else {
        alert(data.message);
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const correo = document.getElementById('loginCorreo').value;
    const contrasena = document.getElementById('loginContrasena').value;

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
    });
    const data = await response.json();
    if (response.ok) {
        sessionStorage.setItem('token', data.token);
        window.location.href = 'editor.html';
    } else {
        alert("Credenciales incorrectas.");
    }
});
