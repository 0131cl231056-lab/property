import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
import propertyModel from "../models/property.model.js"

async function createToken(res , user , message){
    const token = jwt.sign({
        id : user._id
        },config.JWT_SECRET,
        {expiresIn : "7d"}
    )

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true
    })

    res.status(201).json({
        message,
        success : true,
        user : {
            id : user._id,
            fullname : user.fullname, 
            email : user.email, 
            contact : user.contact, 
            role : user.role, 
        }
    })
}

export async function register(req , res){
    console.log("NEW REGISTER CONTROLLER");
    const{
        fullname,
        email,
        password,
        contact,
    } = req.body

    try{

        const isUserAlreadyExists = await userModel.findOne({email})

        if(isUserAlreadyExists){
            return res.status(400).json({
                message : "user with this email already exists",
                success : false
            })
        }

        const user = await userModel.create({
            fullname , 
            email , 
            password , 
            contact , 
        })

        return await createToken(res , user , "user registered successfully")

    }catch(err){

    console.log(err)

    return res.status(500).json({
        message : err.message,
        success : false
    })
}
}

export async function login(req , res){
    const {email , password} = req.body

    try{
        const user = await userModel.findOne({email}).select("+password")

        if(!user){
            return res.status(404).json({
                message : "user not found",
                success : false
            })
        }

        const isPasswordMatched = await user.comparePassword(password)

        if(!isPasswordMatched){
            return res.status(401).json({
                message : "Invalid credentials",
                success : false
            })
        }

        return await createToken(res , user , "user loggedIn successfully")
    }catch(err){
        return res.status(500).json({
            message : "something went wrong",
            success : false
        })
    }
}

export async function getMe(req , res){
    const userId = req.user.id

    try{
        const user = await userModel.findById(userId)

        if(!user){
            return res.status(404).json({
                message : "user not found",
                success : false
            })
        }
        console.log(req.user)

        res.status(200).json({
            message : "user details fetched successfully",
            success : true,
            user : {
                id : user._id,
                fullname : user.fullname, 
                email : user.email, 
                contact : user.contact, 
                role : user.role, 
            }
        })
    }catch(err){
        return res.status(500).json({
            message : "something went wrong",
            success : false
        })
    }
}

export async function logout(req , res){
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: true
    })

    res.status(200).json({
        message : "user loggedout successfully",
        success : true
    })
}


export const addFavorite = async (req, res) => {

    const user = await userModel.findById(req.user.id);

    if (!user.favorites.includes(req.params.propertyId)) {
        user.favorites.push(req.params.propertyId);
        await user.save();
    }

    const property = await propertyModel.findById(req.params.propertyId);

    res.json({
        success: true,
        property
    });
};

export const removeFavorite = async (req, res) => {

    await userModel.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                favorites: req.params.propertyId
            }
        }
    );

    res.json({
        success: true
    });
};


export const getFavorites = async (req, res) => {

    const user = await userModel
        .findById(req.user._id)
        .populate("favorites");

    res.json({
        success: true,
        favorites: user.favorites
    });
};