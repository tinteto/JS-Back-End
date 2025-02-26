import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';



const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        minLength: 10,
    },
    username: {
        type: String,
        required: true,
        minLength: 2,
    },
    password: {
        type: String,
        required: true,
        minLength: 4,
    }
});

userSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 10); 
});


const User = model('User', userSchema);

export default User;
