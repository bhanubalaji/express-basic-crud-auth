
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userScheme = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
    },
    nickname: {
        type: String,
    },
    mobile: {
        type: String,
        required: true
    },
    ischecked: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });


userScheme.methods.generateAuthToken = async function () {
    const user = this
    const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
        expiresIn: process.env.USER_EXPIRE
    })
    return token
}
userScheme.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
        user.confirmPassword = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('users', userScheme)

module.exports = User

