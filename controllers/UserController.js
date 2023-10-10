import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";
import UserModel from "../models/User.js";

export const register = async (req, res) => {
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
        res.status(500).json({ message: 'Registration is invalid' })
    }
};

export const login = async (req, res) => {
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

        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Authorisation is invalid' })
    }
};

export const authMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        if (!user) return res.status(404).json({ message: 'User not found' });
        const { passwordHash, ...userData } = user._doc;
        res.json(userData);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Authentification is invalid' })
    }
}