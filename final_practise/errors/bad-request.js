import CustomAPIErrors from "./custom-api.js";
import StatusCodes from 'http-status-codes';

class BadRequestError extends CustomAPIErrors{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export default BadRequestError;