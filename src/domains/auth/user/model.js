const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    // datos prev registro
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    userType: { type: String, required: true }, // ["worker" || "client"]
    
    // datos post registro
    verified: { type: Boolean, default: false },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    dni: { type: String, required: true },
    birthdate: { type: Date, required: true }, 

    // session token 
    token: String,

    // opcionales:
    adress: String,
    phone: String,

    // perfil del usuario 
    info: String,

    // -------- a futuro
    // profileImg: String <-- No contiene una imágen como tal, sino la referencia 
    //                        de dónde se guardo la imágen dentro de nuestro host
    //                        Todavía falta una utilidad para gestionar imágenes
    //
    // la idea es poner accessLevel como un parámetro del payload del token del usuario
    // accessLevel: { type: String, enum: ['user', 'admin', 'helper'], default: 'user' },
});
 
const User = mongoose.model("User", UserSchema);

module.exports = User;