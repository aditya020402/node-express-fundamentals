class CustomAPIErrors extends Error{
    constructor(message){
        super(message);
    }
}

export default CustomAPIErrors;