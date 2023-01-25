const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const { validationPassword, validationEmail } = require('../../utils/validators/validators');
const userSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true, required: true },
        surname: { type: String, trim: true, required: true },
        image: { type: String, trim: true, required: false, default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" },
        password: { type: String, trim: true, required: true },
        token: {type: String, trim: false, required: false},
        email: { type: String, trim: true, required: true },
        confirmed: {type: Boolean, trim: false, required: false, default: false },
        isAdmin: {type: Boolean, trim: false, required: false, default: false },
        filesToVerify: { type: Array, trim: true, required: false },
        admin: { type: Boolean, trim: true, required: false, default: false },
    }
);


userSchema.pre("save", async function(next){
  if (!this.isModified('password')){
        next();
  }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
});

userSchema.methods.passwordCheck = async function (formPassword) {
    return bcrypt.compare(formPassword, this.password)
}


const User = mongoose.model('usersMontenegro', userSchema);
module.exports = User;