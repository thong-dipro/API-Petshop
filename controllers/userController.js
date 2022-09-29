var generator = require('generate-password');
var User = require("../database/models/userModel");
const { generateToken } = require('../middlewares/authJWT');
const verifyToken = require("../middlewares/verifyJWT");

exports.createUser = async (req, res, next) => {
    var user = new User({
        userName: req.body.username,
        name: req.body.name,
        password: req.body.password,
        role: req.body.role,
    });
    user.save((error, result) => {
        res.send(result)
        next();
        if (error) {
            console.log("Error at user Controller: " + error);
            throw new Error(error)
        }
    })
}

exports.login = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    var user = await User.findOne({ userName: username })
    if (user.password === password) {
        const token = generateToken(user);
        res.send(JSON.stringify(token))
    }
    else {
        res.status(401).json({ status: false, description: "Wrong password or username" })
    }
}

exports.detailUser = async (req, res, next) => {
    const username = req.body.username;
    var user = await User.findOne({ userName: username })
    res.send(JSON.stringify(user))
}

exports.updateUser = async (req, res, next) => {
    var username = req.body.username;
    var id = await User.findOne({ userName: username })
    await User.findOneAndUpdate(
        {
            userName: username
        },
        {
            name: req.body.name,
            password: req.body.password,
            role: req.body.role,
        },
        {
            upsert: true
        })
    res.send("[]")
}

exports.forgotPassword = async (req, res, next) => {
    var username = req.body.username;
    var password = generator.generate({
        length: 10,
        numbers: true,
        lowercase: true,
    })
    await User.findOneAndUpdate(
        {
            userName: username
        },
        {
            password: password
        },
        {
            upsert: true
        })
    res.send(JSON.stringify(password))
}

exports.deleteUser = async (req, res, next) => {
    const username = req.body.username;
    var user = await User.findOne({ userName: username }).exec();
    if (!user) {
        res.status(400).json({ success: false, decription: "no user found!" })
    }
    else
        User.findOneAndDelete({ userName: username }).exec().then(() => {
            res.status(200).json({ success: true })
        }).catch((error) => {
            console.log("Error in delete usercontroller: " + error);
            res.status(500).json({ success: false })
        })
}