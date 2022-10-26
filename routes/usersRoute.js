require('dotenv').config()
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require("../models/userModel");

// Create New User
router.route('/create')
    .post(async (req,res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            await User.create({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            })
            res.status(201).send()
        } catch (err) {
            res.status(500).send()
        }
    })

// Login User
router.route('/login')
.post(async (req,res) => {
    const user = await User.findOne({
                email: req.body.email,
            })
    if (user == null) {
        return res.status(400).send(`User with email address ${req.body.email} does not exist.`)
    }
// Authentication
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET)
            const loggedUser = user.username
            const loggedEmail = user.email
            res.json({ accessToken: accessToken, loggedUser, loggedEmail })
        } else {
            res.send(`wrong passwrod for ${user.email}`)
            console.log(`wrong passwrod for ${user.email}`)
        }
    } catch (err) {
        res.status(500).send()
        return console.log(err)
    }
})

// Update Balance 
router.route('/balance')
    .put(async (req,res) => {
        try {
            const userPackage = {
                email: req.body.email,
                balance: req.body.balance,
                token: req.body.token,
                type: req.body.type
            }

            // Authorization
            const verification = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET)
                if (verification) {
                    const user = await User.findOne({
                        email: userPackage.email
                    })
                    if (userPackage.type == 'withdrawal') {
                        const newBalance = parseFloat(user.balance).toFixed(2) - parseFloat(userPackage.balance).toFixed(2)
                        if (newBalance >= 0) {
                            user.balance = parseFloat(newBalance).toFixed(2)
                        } else { 
                            return res.send(`INSUFFICIENT FUNDS!`) 
                        }
                    } else if (userPackage.type == 'deposit') {
                        const newBalance = parseFloat(user.balance) + parseFloat(userPackage.balance)
                            user.balance = parseFloat(newBalance).toFixed(2)
                    }
                    await user.save()
                    res.send(user)
                    if (user == null) {
                        return res.status(400).send(`User with email address ${userPackage.email} does not exist.`)
                    }
                }
        } catch (err) {
            res.status(500).send()
            return console.log(err)
        }
    })
    .post(async (req,res) => {
        try {
            const userPackage = {
                email: req.body.email,
                token: req.body.token
            }

            // Authorization
            const verification = jwt.verify(userPackage.token, process.env.ACCESS_TOKEN_SECRET)
                if (verification) {
                    const user = await User.findOne({
                        email: userPackage.email
                    })
                        if (user == null) {
                            console.log('no such email')
                            return res.send(`User with email address ${userPackage.email} does not exist.`)
                        }
                    res.send(user)
                } else {
                    res.send('unauthorized')
                }
        } catch (err) {
            res.status(500).send()
            return console.log(err)
        }
    })

// Show All Users
router.route('/users')
    .get(async (req,res) => {
        try {
            const users = await User.find()
            res.send(users)
        } catch (err) {
            console.log(err)
            return res.send({ status: 'error' })
        }
    })


// test get one route
router.route('/test').post(async (req,res) => {
    try {
        const user = await User.findOne(
            {email: req.body.email}
        )
        res.send(user)
    } catch (err) {
        return res.send(err)
    }
})

// Delete User
router.route('/:id')
    .delete(async (req,res) => {
        try {
            const user = await User.findById(req.params.id)
            await user.remove()
            console.log(`User with email of ${user.email} deleted.`)
            res.send({ status: 'ok' })
        } catch (err) {
            if (user == null) {
                console.log('No such user')
            } else {
                console.error(err)
            }
            return res.send({ status: 'error' })
        }
    })

module.exports = router;