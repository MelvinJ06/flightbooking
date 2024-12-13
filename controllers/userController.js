const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async(requestAnimationFrame,res) => {
    const{name,email,password} = requestAnimationFrame.body;
    try{
        const userExits = await User.findOne({email});
        if(userExits){
            return res.status(400).json({message:"the entered user is already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:"1h"
        });

        res.status(201).json({
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    }catch(error){
          res.status(500).json({message:error.message})
    }
};

exports.loginUser = async(requestAnimationFrame,res) => {
    const{email,password} = requestAnimationFrame.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"})
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"invalid password"})
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:"1h"
        });

        res.status(201).json({
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    }catch(error){
          res.status(500).json({message:error.message})
    }
};