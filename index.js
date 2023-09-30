import express from "express";
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import { registerValidation } from "./validation/auth.js";
import { validationResult } from "express-validator";
import UserModel from "./models/User.js"

mongoose
    .connect('mongodb+srv://victoria:wwwww@cluster0.3rxehii.mongodb.net/blog?retryWrites=true&w=majority&appName=AtlasApp')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('Something wrong with DB', err));

const app = express();
app.use(express.json());

const PORT = 4444;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));

app.get('/', (req, res) => {
    res.send('Hello bka bla bla')
});

/*app.post('/auth/login', (req, res) => {
    const token = Jwt.sign({
        email: req.body.email,
        fullName: 'Viktoria Menting'
    },
        'secret123',
    );


    res.json({
        success: true,
        token
    });


})*/

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        };
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            passwordHash,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
        });
        const user = await doc.save();
        res.json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Registration is invalid'
        })
    }
})

