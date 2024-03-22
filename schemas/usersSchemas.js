import Joi from "joi";
import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter"
        },
        token: {
            type: String,
            default: null,
        },
        avatar: {
            type: String,
            default: null
        },
        verificationCode: {
            type: String, 
             
        },
        verify: {
            type: Boolean,
            default: false,
            required: true,
        }
    },
    { versionKey: false }
);

const User = mongoose.model('User', userSchema);

export default User;

export const createUserSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua', 'uk', 'org', 'ca'] } })
        .max(30)
        .trim()
        .required(),
    password: Joi.string()
        .alphanum()
        .min(6)
        .max(30)
        .trim()
        .required(),
    subscription: Joi.string()
        .valid("starter", "pro", "business")
        .default("starter")
});

export const emailSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua', 'uk', 'org', 'ca'] } })
        .max(30)
        .trim()
        .required()
})
