import { User } from '../Models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sendMail from '../Middleware/sendMail.js';

//NEW USER REGISTRATION
export  const registerUser = async (req, res)=>{
    try {
        console.log(req.body)
        const {name, email, password, contact} = req.body;
        let user= await User.findOne({email})     //if while register the email is match to db means the user already exists
        if(user){
            res.status(400).json({
                message: "User Email Already Exists"
            })
        }

        //code to convert raw password to hashed password
        const hashpassword = await bcrypt.hash(password, 10)
        console.log(hashpassword)


        //Generate OTP
        
        const otp = Math.floor(Math.random() * 1000000)
        console.log(otp)

        //create new user data
        user={ name, email, hashpassword, contact }; 

        //Create  signed activation token
        const activationToken = jwt.sign({user, otp}, process.env.ACTIVATION_SECRETE,{
            expiresIn: "5m"
        });
        console.log(activationToken)

        // send mail to user
        const message = `please verify your account using OTP your OTP  is  ${otp}`
        await sendMail(email, "Welcome to Vasanth", message)
        res.status(200).json({
            message: "otp sent to your mail",
            activationToken,    // to chek same otp or not
        });
    } catch (error) {
       return res.status(500).json({
            message: error.message
        })
    }
};

//VERIFY OTP

export const verifyUser = async (req, res) => {
    try {
        const { otp, activationToken} = req.body;
        const verify = jwt.verify(activationToken, process.env.ACTIVATION_SECRETE);
        if(!verify){
            return res.json({
                message: "otp expired",
            });
        }
        if(verify.otp  !== otp){
            return res.json({
                message:"wrong otp",
            });
        }

        await User.create({
            name: verify.user.name,
            email: verify.user.email,
            password: verify.user.hashpassword,
            contact: verify.user.contact,
        });
        return res.status(200).json({
            message: "user registration successful",
        });
    } catch (error) {
       return  res.status(500).json({
            message: error.message
        })
    }
}


//LOGIN USERS

export const loginUser = async (req, res) => {
    try {
        //console.log(req.body)
        const {email, password} = req.body;
        //Check User Email Address
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "Invalid Credentials",
            });
        }
        //Check Password
        const matchPassword = await bcrypt.compare(password, user.password);
        if(!matchPassword){
            return res.status(400).json({
                message: "Invalid Credentials",
            });
        }
        //GENERATE SIGNED TOKEN
        const token = jwt.sign({_id:user.id},process.env.JWT_SECRETE,{
            expiresIn: "10d"
        });
        
        //HIDE THE PASSWORD FIELD BEFORE SENDING THE RESPONSE
        const {password: userPassword, ...userDetails } = user.toObject();

        return res.status(200).json({
            message: "Welcome "+user.name,
            token,
            user: userDetails,          //hide the password
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

//USER PROFILE

export const myProfile = async (req, res) => {
    try {
        console.log(req.User._id)
        const user = await User.findById(req.User._id).select("-password")
        return res.status(200).json({
            user,
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}