const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

//  Conexión a MongoDB (Atlas o Local)
mongoose.connect('mongodb+srv://Atlasadmin:Hola12345@editortextcluster.kc0gvhk.mongodb.net/EditorText?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log(' Conectado a MongoDB'))
    .catch((err) => console.error(' Error al conectar a MongoDB:', err));

//  Modelos de MongoDB
const User = mongoose.model('User', new mongoose.Schema({
    nombre: String,
    apellidos: String,
    correo: { type: String, unique: true, index: true },
    contrasena: String
}));
const Note = mongoose.model('Note', new mongoose.Schema({
    usuarioId: String,
    contenido: String,
    formato: String
}));

//  Ruta de Registro
app.post('/register', async (req, res) => {
    const { nombre, apellidos, correo, contrasena } = req.body;
    try {
        const user = await User.create({ nombre, apellidos, correo, contrasena });
        res.status(201).json({ message: 'Usuario registrado correctamente.', user });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'El correo ya está registrado.' });
        } else {
            res.status(500).json({ message: 'Error al registrar el usuario. Intenta nuevamente.' });
        }
    }
});

//  Ruta de Inicio de Sesión
app.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    try {
        const user = await User.findOne({ correo, contrasena });
        if (user) {
            res.json({ message: 'Inicio de sesión exitoso', user });
        } else {
            res.status(401).json({ message: 'Credenciales incorrectas.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión.' });
    }
});

//  Ruta para Crear Notas
app.post('/note', async (req, res) => {
    const { usuarioId, contenido, formato } = req.body;
    if (!usuarioId) return res.status(400).json({ message: 'Error: Usuario no identificado.' });

    try {
        const note = await Note.create({ usuarioId, contenido, formato });
        res.status(201).json({ message: 'Nota guardada correctamente.', note });
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar la nota.' });
    }
});

//  Ruta para Obtener Notas por Usuario
app.get('/notes/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const notes = await Note.find({ usuarioId });
        res.status(200).json(notes);
    } catch (error) {
        console.error(" Error al obtener las notas:", error);
        res.status(500).json({ message: 'Error al obtener las notas.' });
    }
});

//  Servidor corriendo
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
});