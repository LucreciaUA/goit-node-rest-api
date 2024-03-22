import express from "express";
import { auth } from "../middleware/auth.js";
import { uploadAvatar } from "../controllers/userControllers.js";
import upload from "../middleware/upload.js";

const uploadRouter = express.Router();

uploadRouter.patch('/avatars', auth, upload.single('avatar'), uploadAvatar);

export default uploadRouter