const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Conexión a MongoDB (Atlas o Local)
mongoose.connect('mongodb+srv://Atlasadmin:Hola12345@editortextcluster.kc0gvhk.mongodb.net/EditorText?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// ✅ Modelos de MongoDB
const User = mongoose.model('User', new mongoose.Schema({
    nombre: String,
    apellidos: String,
    correo: { type: String, unique: true },
    contrasena: String
}));

const Note = mongoose.model('Note', new mongoose.Schema({
    usuarioId: String,
    contenido: String,
    formato: String
}));

// ✅ Ruta para Crear Notas
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

// ✅ Ruta para Obtener Notas por Usuario
app.get('/notes/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const notes = await Note.find({ usuarioId });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las notas.' });
    }
});

// ✅ Ruta para Eliminar Notas
app.delete('/note/:noteId', async (req, res) => {
    const { noteId } = req.params;
    try {
        const result = await Note.findByIdAndDelete(noteId);
        if (result) {
            res.status(200).json({ message: 'Nota eliminada correctamente.' });
        } else {
            res.status(404).json({ message: 'Nota no encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la nota.' });
    }
});

// ✅ Ruta para Editar Notas
app.put('/note/:noteId', async (req, res) => {
    const { noteId } = req.params;
    const { contenido } = req.body;
    try {
        const updatedNote = await Note.findByIdAndUpdate(noteId, { contenido }, { new: true });
        res.status(200).json({ message: 'Nota actualizada correctamente.', note: updatedNote });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la nota.' });
    }
});

// ✅ Servidor corriendo
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
