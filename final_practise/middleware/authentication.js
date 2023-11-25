import UnauthenticatedError from "../errors/unauthenticated.js";
import UnauthorizedError from "../errors/unauthorized.js";

import {isTokenValid} from "../utils/jwt.js";

import {attachCookieToResponse} from "../utils/index.js";

export const authenticateUser = async(req,res,next) => {
    const {refreshToken,accessToken} = req.signedCookies;

    try{
        if(accessToken){
            const payload = isTokenValid (accessToken);
            if(!payload){
                throw new UnauthenticatedError("Authentication invalid");
            }
            req.user = payload.user;
            return next();
        }
        const payload = isTokenValid(refreshToken);
        const existingToken = await Token.findOne({user:payload.user.userId},
        {refreshToken:payload.refreshToken});
        if(!existingToken || !existingToken?.isValid){
            throw new UnauthenticatedError('Authentication Invalid');
        }
        attachCookieToResponse({
            res,
            user:payload.user,
            refreshToken:existingToken,
        });
        req.user = payload.user;
        next();
    }
    catch(error){
        throw new UnauthenticatedError('Authentication Invalid');
    }
};

export const authorizePermissions = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            throw new UnauthorizedError('Unauthorized to access this route');
        }
        next();
    }
}





