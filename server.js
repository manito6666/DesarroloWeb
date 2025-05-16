
// Importando módulos necesarios
const express = require('express'); // Manejar el servidor
const mongoose = require('mongoose'); // Conectar con la base de datos MongoDB
const cors = require('cors'); // Aceptar peticiones
const jwt = require('jsonwebtoken'); // Autenticación con tokens JWT
const app = express(); // Crear la aplicación 

app.use(cors()); // Permitir peticiones desde cualquier origen
app.use(express.json()); // Permitir manejo de JSON

// Conectar a la base de datos de MongoDB
mongoose.connect('mongodb+srv://Atlasadmin:Hola12345@editortextcluster.kc0gvhk.mongodb.net/EditorText', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conectado a MongoDB')) // Si se conecta bien
    .catch((err) => console.error('Error al conectar a MongoDB:', err)); // Si falla

// Modelos de MongoDB
// Modelo de usuario
const userSchema = new mongoose.Schema({
    nombre: String,
    correo: { type: String, unique: true, index: true }, // El correo debe ser único
    contrasena: String
});
const User = mongoose.model('User', userSchema);

// Modelo de notas
const noteSchema = new mongoose.Schema({
    usuarioId: String, // ID del usuario que creó la nota
    contenido: String // El contenido de la nota
});
const Note = mongoose.model('Note', noteSchema);

// Función para generar un token JWT
function generarToken(id) {
    return jwt.sign({ userId: id }, 'secreto_jwt', { expiresIn: '1h' }); // Token que dura 1 hora
}

// Middleware para verificar el token JWT
function verificarToken(req, res, next) {
    const token = req.headers['authorization']; // Obtenemos el token
    if (token) {
        jwt.verify(token, 'secreto_jwt', (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Token inválido.' });
            req.userId = decoded.userId; // Guardamos el ID del usuario
            next();
        });
    } else {
        res.status(401).json({ message: 'No autenticado.' }); // Si no hay token
    }
}

// Registro de usuario
app.post('/register', (req, res) => {
    const { nombre, correo, contrasena } = req.body; // Datos del usuario

    User.create({ nombre, correo, contrasena })
        .then(user => res.status(201).json({ message: 'Usuario registrado.', token: generarToken(user._id) }))
        .catch(err => {
            if (err.code === 11000) {
                res.status(400).json({ message: 'El correo ya está registrado.' });
            } else {
                console.error(err); // Muestra el error en consola para debug
                res.status(500).json({ message: 'Error al registrar.' });
            }
        });
});

// Inicio de sesión
app.post('/login', (req, res) => {
    const { correo, contrasena } = req.body; // Datos para iniciar sesión

    User.findOne({ correo, contrasena })
        .then(user => {
            if (user) {
                res.json({ message: 'Inicio de sesión exitoso.', token: generarToken(user._id) });
            } else {
                res.status(401).json({ message: 'Credenciales incorrectas.' });
            }
        })
        .catch(() => res.status(500).json({ message: 'Error al iniciar sesión.' }));
});

// Rutas de Usuarios
// Obtener todos los usuarios (solo admin)
app.get('/users', verificarToken, (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(() => res.status(500).json({ message: 'Error al cargar usuarios.' }));
});

// Eliminar usuario y sus notas (solo admin)
app.delete('/user/:id', verificarToken, (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(user => {
            if (user) {
                Note.deleteMany({ usuarioId: req.params.id }).then(() => {
                    res.json({ message: 'Usuario y sus notas eliminados.' });
                });
            } else {
                res.status(404).json({ message: 'Usuario no encontrado.' });
            }
        })
        .catch(() => res.status(500).json({ message: 'Error al eliminar usuario.' }));
});

// Rutas de Notas
// Crear nota
app.post('/note', verificarToken, (req, res) => {
    const { contenido } = req.body;
    Note.create({ usuarioId: req.userId, contenido })
        .then(note => res.status(201).json(note))
        .catch(() => res.status(500).json({ message: 'Error al crear nota.' }));
});

// Obtener todas las notas
app.get('/notes', verificarToken, (req, res) => {
    Note.find({ usuarioId: req.userId })
        .then(notes => res.json(notes))
        .catch(() => res.status(500).json({ message: 'Error al cargar notas.' }));
});

// Obtener una nota específica
app.get('/note/:id', verificarToken, (req, res) => {
    Note.findById(req.params.id)
        .then(note => note ? res.json(note) : res.status(404).json({ message: 'Nota no encontrada.' }))
        .catch(() => res.status(500).json({ message: 'Error al cargar nota.' }));
});

// Actualizar nota
app.put('/note/:id', verificarToken, (req, res) => {
    const { contenido } = req.body;
    Note.findByIdAndUpdate(req.params.id, { contenido }, { new: true })
        .then(note => note ? res.json({ message: 'Nota actualizada.', note }) : res.status(404).json({ message: 'Nota no encontrada.' }))
        .catch(() => res.status(500).json({ message: 'Error al actualizar nota.' }));
});

// Eliminar nota
app.delete('/note/:id', verificarToken, (req, res) => {
    Note.findByIdAndDelete(req.params.id)
        .then(note => note ? res.json({ message: 'Nota eliminada.' }) : res.status(404).json({ message: 'Nota no encontrada.' }))
        .catch(() => res.status(500).json({ message: 'Error al eliminar nota.' }));
});

// Iniciar el servidor
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
