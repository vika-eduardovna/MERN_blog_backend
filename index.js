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

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        };

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Password or login are not correct' })
        };

        const token = Jwt.sign({
            _id: user._id,
        },
            'secret123',
            {
                expiresIn: '30d',
            }
        );

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Authorisation is invalid'
        })
    }
})

app.post('/auth/register', registerValidation, async (req, res) => {
    // checkin if no errors
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        };

        //hash encryption
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // creating document in BD
        const doc = new UserModel({
            email: req.body.email,
            passwordHash: hash,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
        });

        //document was created
        const user = await doc.save();

        //encrypt _id only
        const token = Jwt.sign({
            _id: user._id,
        },
            'secret123',
            {
                expiresIn: '30d',
            }
        );

        const { passwordHash, ...userData } = user._doc // exclude passwordHash from user._doc

        res.json({
            ...userData,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Registration is invalid'
        })
    }
})

