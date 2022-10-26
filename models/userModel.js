const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    roles: [{
        type: String,
        default: "Member"
    }],
    active: {
        type: Boolean,
        default: true
    },
    balance: {
        type: Number,
        default: 0
    }
})

const Users = mongoose.model("Users", userSchema)

module.exports = Users;