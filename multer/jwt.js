import jwt from "jsonwebtoken";

const createJWT = ({obj}) => {
    // console.log(param);
    // console.log(payload);
    const token = jwt.sign(obj,"learningnode");
    return token;
}


export default createJWT;