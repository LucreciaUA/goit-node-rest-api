
import User from "../schemas/usersSchemas.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUserSchema } from "../schemas/usersSchemas.js";
import dotenv from "dotenv";
dotenv.config();
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import gravatar from 'gravatar';
import Jimp from 'jimp';
import crypto from 'crypto'

import sendEmail from "../email-api/email-node.js";



export const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const isExist = await User.findOne({ email: email.toLowerCase() });
        if (isExist !== null) {
            res.status(409).json({ message: 'User with this email already exists' });
        } else {
            const normalizedEmail = email.toLowerCase().trim()

            const validationResult = createUserSchema.validate({
            email: email,
            password: password
        });
      if (validationResult.error) {
       return res.status(400).json({ message: validationResult.error.message });
      }
            
            
            const hashPassword = await bcrypt.hash(password, 10)
            let avatarUrl = isExist && isExist.avatar;

        if (!avatarUrl) {
            
            avatarUrl = gravatar.url(normalizedEmail, { s: '250', r: 'pg', d: 'identicon' });
        }
            const verificationCode = crypto.randomUUID()
            const data = await User.create({ email: normalizedEmail, password: hashPassword, avatar: avatarUrl, verificationCode: verificationCode });
            const base = process.env.BASE
            const emailOptions = {
            from: 'lucreciaua@meta.ua',
            to: normalizedEmail,
            subject: "Verify email",
                html: `<p>We're happy you're here! Let's get your email address verified:</p> 
                <a href="https://${base}/api/auth/verify/${verificationCode}">Click to Verify Email</a>.
            <p>If you did not register for this service, we recommend ignoring this letter.</p>`
            };
            await sendEmail(emailOptions);
            res.status(200).json({ message: 'Welcome!' });
            
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        

        const normalizedEmail = email.toLowerCase().trim();


        const user = await User.findOne({ email: normalizedEmail });

        if (user===null) {
            return res.status(401).json({ message: 'Incorrect password or email' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password or email' });
        }

         const payload = {
         id: user._id,
            };

        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "23h" })
        await User.findByIdAndUpdate(user._id, { token: token });
        console.log(token)
        res.status(200).json({ message: `Welcome, ${email, user}` });

    }  catch (error) {
        console.error('Error login user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const loguotUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await User.findByIdAndUpdate(req.user.id, { token: null });
        res.status(200).json({ message: 'Logout successful' });
    } catch(error) {
        console.error('Error logout user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if(user){
            res.status(200).json({ message: `Welcome, ${user.email}` })
        }
        else {
            res.status(404).json({message:"Unauthorized"})
        }
    }
    catch(error) {
        console.error('Error user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const uploadAvatar = async (req, res) => {
    try {
        console.log(req.file)
        await fs.rename(req.file.path, path.join(process.cwd(), 'public/avatars', req.file.filename))
        
    
        const avatarPath = path.join(process.cwd(), 'public/avatars', req.file.filename);
        const image = await Jimp.read(avatarPath);
        await image.resize(250, 250);
        await image.writeAsync(avatarPath); 
        const user = await User.findByIdAndUpdate(req.user.id, { avatar: req.file.filename }, { new: true })
       if (user === null) {
      res.status(404).json({ message: `User not found` })  
    }
        res.status(200).json({ message: `${user.email}'s avatar has been uploaded` })
   }
     catch(error) {
        console.error('Error user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const verifyEmail = async (req, res) => {
    try{
    const { verificationCode } = req.params;
    const user = await User.findOne({ verificationCode })
    if (!user) {
        res.status(404).json({ message: `User not found` }) 
    }

        await user.updateOne({ verify: true, verificationCode: '' })
        res.status(200).json({ message: 'Verified' });
    }
    catch(error) {
        console.error('Error user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const sendAgain = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(req.body)
        const user = await User.findOne({ email })
        console.log(user)
        if (!user) {
            res.status(404).json({ message: `User not found` }) 
        }
        const { verify, verificationCode } = user
        console.log(verify, verificationCode)
        if(verify){
            res.status(400).json({ message: `Already verified` })
        }
        else {
            const base = process.env.BASE
            const emailOptions = {
            from: 'lucreciaua@meta.ua',
            to: email,
            subject: "Verify email",
                html: `<p>We're happy you're here! Let's get your email address verified:</p>
<a href="https://${base}/api/auth/verify/${verificationCode}">Click to Verify Email</a>.
<p>If you did not register for this service, we recommend ignoring this letter.</p>`

            };
            await sendEmail(emailOptions);
            res.status(200).json({ message: `Verification email resended.` })
        }
    } catch (error) {
         console.error('Error resending email:', error);
        res.status(500).json({ message: 'Server error' });
    }
}