// ✅ server.js (Hecho por un Alumno, Limpio y Claro)
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
}).then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ Error al conectar:', err));

// ✅ Modelos de MongoDB (Usuarios y Notas)
const User = mongoose.model('User', {
    nombre: String,
    apellidos: String,
    correo: { type: String, unique: true },
    contrasena: String
});

const Note = mongoose.model('Note', {
    usuarioId: String,
    contenido: String,
    formato: String
});

// ✅ Función para Generar Token
function generarToken(id) {
    return jwt.sign({ userId: id }, 'secreto_jwt', { expiresIn: '1h' });
}

// ✅ Verificar Token (Middleware)
app.use((req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        jwt.verify(token, 'secreto_jwt', (err, decoded) => {
            if (!err) req.userId = decoded.userId;
        });
    }
    next();
});

// ✅ Registro de Usuarios
app.post('/register', async (req, res) => {
    const { nombre, apellidos, correo, contrasena } = req.body;
    try {
        const user = await User.create({ nombre, apellidos, correo, contrasena });
        res.status(201).json({ message: 'Usuario registrado.', token: generarToken(user._id) });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'El correo ya está registrado.' });
        } else {
            res.status(500).json({ message: 'Error al registrar.' });
        }
    }
});

// ✅ Inicio de Sesión
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
app.post('/note', async (req, res) => {
    if (!req.userId) return res.status(403).json({ message: 'No autenticado.' });
    const note = await Note.create({ usuarioId: req.userId, contenido: req.body.contenido, formato: 'html' });
    res.status(201).json({ message: 'Nota creada.', note });
});

// ✅ Obtener Notas del Usuario
app.get('/notes', async (req, res) => {
    if (!req.userId) return res.status(403).json({ message: 'No autenticado.' });
    const notes = await Note.find({ usuarioId: req.userId });
    res.json(notes);
});

// ✅ Actualizar Nota
app.put('/note/:id', async (req, res) => {
    if (!req.userId) return res.status(403).json({ message: 'No autenticado.' });
    const note = await Note.findByIdAndUpdate(req.params.id, { contenido: req.body.contenido }, { new: true });
    res.json(note ? { message: 'Nota actualizada.', note } : { message: 'Nota no encontrada.' });
});

// ✅ Eliminar Nota
app.delete('/note/:id', async (req, res) => {
    if (!req.userId) return res.status(403).json({ message: 'No autenticado.' });
    const note = await Note.findByIdAndDelete(req.params.id);
    res.json(note ? { message: 'Nota eliminada.' } : { message: 'Nota no encontrada.' });
});

// ✅ Obtener Usuarios (Solo para Admin)
app.get('/users', async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No autenticado.' });

    const decoded = jwt.verify(token, 'secreto_jwt');
    const user = await User.findById(decoded.userId);

    if (user.correo === 'admin@gmail.com') {
        const users = await User.find();
        res.json(users);
    } else {
        res.status(403).json({ message: 'Acceso no autorizado.' });
    }
});

// ✅ Eliminar Usuario (Solo para Admin)
app.delete('/user/:id', async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No autenticado.' });

    const decoded = jwt.verify(token, 'secreto_jwt');
    const user = await User.findById(decoded.userId);

    if (user.correo === 'admin@gmail.com') {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Usuario eliminado.' });
    } else {
        res.status(403).json({ message: 'Acceso no autorizado.' });
    }
});

// ✅ Servidor corriendo
app.listen(3000, () => console.log('✅ Servidor corriendo en http://localhost:3000'));

