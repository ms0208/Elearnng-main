import jwt  from 'jsonwebtoken';
import UserModel from'../models/user.js'; // adjust the path as needed

export const checkUserAuth = async (req, res, next) => {
    let token;
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith('Bearer')) {
        try {
            token = authorization.split(' ')[1];
            console.log("TOKEN:", token);
            console.log("Authorization Header:", authorization);

            // Verify the token
            const { id } = jwt.verify(token, process.env.JWT_SK);
            console.log("Decoded userID:", id);

            // Attach user info to the request object (excluding password)
            req.user = await UserModel.findById(id).select('-password');
            console.log("User found:", req.user);

            next(); // Proceed to the next middleware/route handler
        } catch (error) {
            console.error("JWT Verification Error:", error.message);
            return res.status(401).json({
                status: "failed",
                message: "Unauthorized User",
            });
        }
    } else {
        return res.status(401).json({
            status: "failed",
            message: "Unauthorized User, No Token Provided",
        });
    }
};
