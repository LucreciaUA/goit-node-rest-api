import jwt from "jsonwebtoken"
import User from "../schemas/usersSchemas.js"


export const auth = async (req, res, next) => {
    console.log(req.headers);
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(' ');
    console.log(bearer)

    if (bearer !== 'Bearer') {
        return res.status(401).json({message: 'Unauthorized'});
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        req.user = user;
        next(); // Call next to proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error auth:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


   