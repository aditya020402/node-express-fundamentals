import isTokenValid from "../utils/jwt.js";
import UnauthenticatedError  from "../errors/unauthenticated.js";
import UnauthorizedError from "../errors/unauthorized.js";
const authenticateUser = async(req,res,next) => {
    let token; 
    const authHeader = req.headers.authorization;
    if(authHeader && authHeader.startsWith('Bearer')){
        token = authHeader.split(' ')[1];
    }
    else if(req.cookies.token){
        token = req.cookies.token;
    }
    if(!token){
        throw new UnauthenticatedError("Authentication Invalid");
    }
    try{
        const payload = isTokenValid(token);
        req.user = {userId:payload.user.userId,
        role:payload.user.role,
        };
        next();
    }
    catch(error){
        throw new UnauthenticatedError("Authentication Invalid");
    }
};


const authorizeRoles = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            throw new UnauthorizedError("Unauthorized to access this route");
        }
        next();
    }
}

export {authenticateUser,authorizeRoles};