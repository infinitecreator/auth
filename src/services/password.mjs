import bcrypt from 'bcrypt' ;
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
// import {promisify} from 'util' ;

// const bcryptAsync = promisify(bcrypt) ;


export class Password {
    // static toHash(password, callback) {
    //     bcrypt.genSalt(saltRounds, function(err, salt){
    //         if(err) throw new Error({message: err.message, statusCode: err.statusCode}) ;

    //         bcrypt.hash(password, salt, function(err, hash){
    //             if(err) throw new Error({message: err.message, statusCode: err.statusCode}) ;
    //             // console.log(hash.toString('hex') + ":" + salt, 'inside callback');
    //             callback(hash.toString('hex') + ":" + salt) ;

    //         }) ;

    //     }) ;
    // }
    static async toHashAsync(password){
        try {

            const salt = await bcrypt.genSalt(saltRounds) ;
            const hash = await bcrypt.hash(password, salt) ;
            // wwlw ;
            return hash.toString('hex') + ":" + salt ; 
            // walla ;

        } catch(err) {
            // console.log(err,'tohasherror') ;
            // throw new Error({ serializeErrors: function(){ return err.message }, statusCode: err.code}) ;
            throw err ;

        }
        


    }
    static async compareAsync(password, actual) {
        try {
            const [password_hex, salt] = actual.split(":") ;
            // const salt = password_array[1] ;
            const hash  = await bcrypt.hash(password, salt) ;

            return hash.toString('hex') === password_hex ;

        } catch(err) {
            throw err ;
        }
        
  
    }
}