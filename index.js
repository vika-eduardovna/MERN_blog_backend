import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import { register, login, authMe } from "./controllers/UserController.js";
import { create, getOne, getAll, remove, update } from "./controllers/PostController.js"


mongoose
    .connect('mongodb+srv://victoria:wwwww@cluster0.3rxehii.mongodb.net/blog?retryWrites=true&w=majority&appName=AtlasApp')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('Something wrong with DB', err));

const app = express();
app.use(express.json());

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});


const upload = multer({ storage });

const PORT = 4444;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));


app.post('/auth/login', loginValidation, login);
app.post('/auth/register', registerValidation, register);
app.get('/auth/me', checkAuth, authMe);
app.use('/uploads', express.static('uploads'));
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    });
});

app.get('/posts', getAll);
app.get('/posts/:id', getOne);
app.post('/posts', checkAuth, postCreateValidation, create);
app.delete('/posts/:id', checkAuth, remove);
app.patch('/posts/:id', checkAuth, update);