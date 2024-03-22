import express from "express";
import { currentUser, loginUser, loguotUser, registerUser} from "../controllers/userControllers.js";
import { auth } from "../middleware/auth.js";


const usersRouter = express.Router();

usersRouter.post('/register', registerUser)
usersRouter.post('/login', loginUser)
usersRouter.get('/logout', auth, loguotUser)
usersRouter.get('/current', auth, currentUser)

export default usersRouter;