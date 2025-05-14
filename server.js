// ✅ server.js (Súper Simplificado y Claro)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Conexión a MongoDB
mongoose.connect('mongodb+srv://Atlasadmin:Hola12345@editortextcluster.kc0gvhk.mongodb.net/EditorText', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Conectado a MongoDB')).catch((err) => console.error('❌ Error al conectar:', err));

// ✅ Modelos de MongoDB
const User = mongoose.model('User', { nombre: String, apellidos: String, correo: String, contrasena: String });
const Note = mongoose.model('Note', { usuarioId: String, contenido: String, formato: String });

// ✅ Función para generar Token
function generarToken(id) {
    return jwt.sign({ userId: id }, 'secreto_jwt', { expiresIn: '1h' });
}

// ✅ Middleware para verificar JWT
function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Acceso denegado.' });

    jwt.verify(token, 'secreto_jwt', (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token inválido.' });
        req.userId = decoded.userId;
        next();
    });
}

// ✅ Registro
app.post('/register', async (req, res) => {
    const { nombre, apellidos, correo, contrasena } = req.body;
    try {
        const user = await User.create({ nombre, apellidos, correo, contrasena });
        res.status(201).json({ message: 'Usuario registrado.', token: generarToken(user._id) });
    } catch (error) {
        res.status(400).json({ message: 'Correo ya registrado.' });
    }
});

// ✅ Login
app.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    const user = await User.findOne({ correo, contrasena });
    if (user) {
        res.json({ message: 'Inicio de sesión exitoso.', token: generarToken(user._id) });
    } else {
        res.status(401).json({ message: 'Credenciales incorrectas.' });
    }
});

// ✅ Crear Nota
app.post('/note', verificarToken, async (req, res) => {
    const { contenido, formato } = req.body;
    const note = await Note.create({ usuarioId: req.userId, contenido, formato });
    res.status(201).json({ message: 'Nota creada.', note });
});

// ✅ Obtener Notas
app.get('/notes', verificarToken, async (req, res) => {
    const notes = await Note.find({ usuarioId: req.userId });
    res.json(notes);
});

// ✅ Actualizar Nota
app.put('/note/:id', verificarToken, async (req, res) => {
    const { contenido } = req.body;
    const note = await Note.findByIdAndUpdate(req.params.id, { contenido }, { new: true });
    if (note) {
        res.json({ message: 'Nota actualizada.', note });
    } else {
        res.status(404).json({ message: 'Nota no encontrada.' });
    }
});

// ✅ Eliminar Nota
app.delete('/note/:id', verificarToken, async (req, res) => {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (note) {
        res.json({ message: 'Nota eliminada.' });
    } else {
        res.status(404).json({ message: 'Nota no encontrada.' });
    }
});

// ✅ Servidor corriendo
app.listen(3000, () => console.log('✅ Servidor corriendo en http://localhost:3000'));

