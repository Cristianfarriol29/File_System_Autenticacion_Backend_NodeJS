const User = require('./users.model');
const bcrypt = require('bcrypt');
const {generateToken} = require('../../utils/jwt/jwt.js');
const nodemailer = require("nodemailer");
const {generateID} = require("../../utils/generateID/generateID.js")





const register = async (req, res, next) => {



    try {
        const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,12}$/;
        const {name, email, surname, password, parametro} = req.body
        if(password.length < 8){
            return res.json("¡Password is too short!")
        }
        if(!regexp.test(password)){
            return res.json("¡The password does not meet the minimum security requirements!. Remember that it must have 8 to 12 characters and that it must include at least: One uppercase character, one lowercase character, one number and one special character!")
        }
        

        const user = new User();
        user.name = name;
        user.email = email;
        user.surname = surname;
        if (req.file) user.image = req.file.path
        user.password = password;
        user.token = generateID();
        // Miramos si el email existea
        const userExist = await User.findOne({ email: user.email })
        if (userExist) {
            // TODO: Errores
            const error = new Error("The email already exists, you can request to create a new password if you have forgotten it!");
            return res.json({msg: error.message})
        }
        const userDB = await user.save();

        return res.status(201).json(userDB)

    }
    
    catch (error) {
        const err = new Error("An error occurred with the registry.");
        return res.status(404).json({msg: err.message})
    }
}

const confirm = async (req, res, next) => {

    const {token} = req.params;
    const userConfirm = await User.findOne({token})
    if (!userConfirm){
        const error = new Error("Token is invalid")
        return res.status(403).json({msg: error.message})
    }

    try {
        userConfirm.confirmed = true;
        userConfirm.token = "";
        await userConfirm.save()
        return res.status(200).json({msg: "¡Confirmed user!"})
    } catch (error) {
        console.log(error)
    }
}

const login = async (req, res, next) => {

 
    try {
        // Comprobamos que existe el email para logarse

        const user = await User.findOne({ email: req.body.email })

        if(!user){
            const error = new Error("The user don't exist");
            return res.json({msg: error.message})
        }
        if(!await user.passwordCheck(req.body.password)){
            const error = new Error("The email or password is not correct, check them and try again");
            return res.json({msg: error.message})
        }

        if (!user.confirmed){
            const error = new Error("¡You haven't confirmed your account yet!");
            return res.json({msg: error.message})
        }
        if (await user.passwordCheck(req.body.password)) {
                 // Generamos el Token
            const token = generateToken(user._id, user.email);
            user.token = token;
            await user.save()
            // Devolvemos el Token al Frontal
            return res.json(user);
        } else {
            const error = new Error("The email or password is not correct, check them and try again");
            return res.json({msg: error.message})
        }
           

    } catch (error) {

        const err = new Error("An error occurred with the login.");
        return res.json({msg: err.message})
    }
}

const logout = async (req, res, next) => {

    const {token} = req.params;

    const userConfirm = await User.findOne({token})
    try {

        // Te elimina el token -> Es decir te lo devuelve en null
        userConfirm.token = null;
        await userConfirm.save()

        return res.status(201).json(userConfirm.token)
    } catch (error) {
        return next(error)
    }
}

const forgotPassword = async (req, res, next) => {

    const {email, parametro} = req.body;
    
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("User does not exist");
            return res.status(404).json({msg: error.message})
        }

    try {
        user.token = generateID()
        await user.save()

        res.json(user)
    } catch (error) {
        console.log(error)
    }

}


const verifyToken = async (req, res, next) => {

    const {token} = req.params;


const tokenValido = await User.findOne({token})
if (tokenValido){
    return res.json(tokenValido)
} else {
    const error = new Error("The Token is invalid");
    return res.json({msg: error.message})
}

}

const verifyAdminByEmail = async (req, res, next) => {

    const {token} = req.params;
    const email = token
    try {
        const user = await User.findOne({email})
        res.json(user)
    } catch (error) {
        res.json("You are not allowed to enter this Area")
    }
    

}

const newPassword = async (req, res, next) => {

    const {token} = req.params;
    const {password} = req.body;
    
    const user = await User.findOne({token})
    
    if (user){
        user.password = password;
        user.token = "";
        await user.save();
        res.json({msg: "Password successfully updated"})
    }else {
        const error = new Error("The Token is invalid");
        return res.status(404).json({msg: error.message})
    }

    try {
        
    } catch (error) {
        
    }
}



const filesToVerify = async (req, res, next) => {

    const {email, fullPath} = req.body

    try {

        const user = await User.findOne({email})
        user.filesToVerify.push(fullPath)
        await user.save()
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }

}


const changeFilesStatus = async (req, res, next) => {

    const {email, fullPath} = req.body


try {
    const user = await User.findOne({email})
   user.filesToVerify = user.filesToVerify.filter(v => v !== fullPath)
    await user.save()
    return res.status(200).json(user)
} catch (error) {
    
}


}

module.exports = { register, login, logout, confirm, forgotPassword, verifyToken, newPassword, verifyAdminByEmail, filesToVerify, changeFilesStatus }