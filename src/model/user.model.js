const mongoose= require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: {true, message: 'Username is required'},
        unique: {true, message: 'Username is already taken'}
    },
    email: {
        type: String,
        required: {true, message: 'Email is required'},
        unique: {true, message: 'Account with this email already exists'}
    },
    password: {
        type: String,
        required: {true, message: 'Password is required'}
    }
});

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
