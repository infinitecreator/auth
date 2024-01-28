
export class CustomError extends Error {
    statusCode = new Error('abstract variable')  ;
    constructor(message) {
        super(message) ;
        Object.setPrototypeOf(this, CustomError.prototype) ;

    };

    serializeErrors() {
        throw new Error("this is an abstract mesthod") ;
    } ;

}