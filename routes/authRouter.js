import express from "express";
import { sendAgain, verifyEmail } from "../controllers/userControllers.js";
import validateBody from "../helpers/validateBody.js";
import { emailSchema } from "../schemas/usersSchemas.js";

const authRouter = express.Router();


authRouter.post('/verify/:verificationToken', verifyEmail)
authRouter.post('/verify', validateBody(emailSchema), sendAgain)

export default authRouter;