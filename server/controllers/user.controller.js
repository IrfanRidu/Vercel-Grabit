import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import genertedRefreshToken from '../utils/generatedRefreshToken.js'
import uploadImageClodinary from "../utils/uploadImageClodinary.js";
import generatedOtp from "../utils/generatedOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from "jsonwebtoken"

//register user
export async function registerUserController(request,response) {
    try {
        const {email,name,password}=request.body;

        if(!name||!email||!password){
            return response.status(400).json({
                message:"Please Provide Name,Email and Password",
                error:true,
                success:false
            })
        }

        const user = await UserModel.findOne({email});
        if (user){

            return response.status(400).json({
                message:"This Email is already registerd",
                error:true,
                success:false
            })
        }

        // const salt = await bcryptjs.genSalt(10);
        // const hashedPassword=bcryptjs.hash(password,salt);

        const payload={
            name,
            email,
            // password:hashedPassword
            password
        }

        const newUser=new UserModel(payload);
        const save = await newUser.save();

        const verifyEmailUrl=`${process.env.FRONTEND_URL}/verify-email ? code=${save?._id} `

        const verifyEmail= await sendEmail({
            sendTo:email,
            subject:"Grabit verification",
            html:verifyEmailTemplate({
                name,
                url:verifyEmailUrl
            })
        })

        return response.status(200).json({
            message:"User regesterd successfully",
            error:false,
            success:true,
            data:save
        })

    } catch (error) {
        return response.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
    
};

//Email Verification

export async function verifyEmailController(request,response){
    try {
        const { code } = request.body

        const user = await UserModel.findOne({ _id : code})

        if(!user){
            return response.status(400).json({
                message : "Invalid code",
                error : true,
                success : false
            })
        }

        const updateUser = await UserModel.updateOne({ _id : code },{
            verify_email : true
        })

        return response.json({
            message : "Verify email done",
            success : true,
            error : false
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
};


// login Controller

export async function loginController(request,response) {
    
    try {

        const {email,password}=request.body;


        if(!email||!password){
            return response.status(400).json({
                message:"Please Provid Email and Password",
                error:true,
                success:false
            })
        }

        const user = await UserModel.findOne({email});


        if (!user){

            return response.status(400).json({
                message:"This Email is not registerd",
                error:true,
                success:false
            })
        }


        if (user.status!=="Active"){

            return response.status(400).json({
                message:"Account is not active",
                error:true,
                success:false
            })
        }


        // const checkPassword=await bcrypt.compare(password,user.password)


        // if (!checkPassword){

        //     return response.status(400).json({
        //         message:"Incorrect Password",
        //         error:true,
        //         success:false
        //     })
        // }

        if (user.password!==password){

            return response.status(400).json({
                message:"Incorrect Password",
                error:true,
                success:false
            })
        }

        const accesstoken = await generatedAccessToken(user._id)
        const refreshToken = await genertedRefreshToken(user._id)

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        })

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        response.cookie('accessToken',accesstoken,cookiesOption)
        response.cookie('refreshToken',refreshToken,cookiesOption)

        return response.json({
            message : "Login successfully",
            error : false,
            success : true,
            data : {
                accesstoken,
                refreshToken
            }
        })
    
    } catch (error) {
        response.status(500).json({

            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//logout controller
export async function logoutController(request,response) {
    try {
        const userid = request.userId //middleware

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        response.clearCookie("accessToken",cookiesOption)
        response.clearCookie("refreshToken",cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
            refresh_token : ""
        })

        return response.json({
            message : "Logout successfully",
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    } 
}

//upload user avatar
export async  function uploadAvatar(request,response){
    try {
        const userId = request.userId // auth middlware
        const image = request.file  // multer middleware
// console.log(image)
        const upload = await uploadImageClodinary(image)
        
        const updateUser = await UserModel.findByIdAndUpdate(userId,{
            avatar : upload.url
        })

        return response.json({
            message : "upload profile",
            success : true,
            error : false,
            data : {
                _id : userId,
                avatar : upload.url
            }
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


//update user data

export async function updateUserDetails(request,response) {
    try {
       
        const userId=request.userId
        const {name,email,mobile,password}=request.body;

        const updateUser=await UserModel.updateOne({_id:userId},{
            ...(name && {name:name}),
            ...(email && {email:email}),
            ...(mobile && {mobile:mobile}),
            ...(password && {password:password}),
        })

        return response.status(200).json({
            message : "User updated successfully",
            error : false,
            success : true,
            data:updateUser
        })
        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        }) 
    }
}

//forget password

export async function forgotPassword(request,response) {
    
try {

    const {email}=request.body

    const user = await UserModel.findOne({email})

    if(!user){
        return response.status(400).json({
            message : "Invalid email",
            error : true,
            success : false 
    })

    }

    const otp=generatedOtp();
    const expireTime= new Date()+60*60*1000 //1hr

    const otpUpdate= await UserModel.findByIdAndUpdate(user._id,{
        forgot_password_otp:otp,
        forgot_password_expiry:new Date(expireTime).toISOString()
    })

    await sendEmail({
        sendTo:email,
        subject:"Grabit reset password otp",
        html:forgotPasswordTemplate({
            name:user.name,
            otp:otp
        })
    })

    return response.status(200).json({
        message : "Check Your Email",
        error : false,
        success : true
    })


        
} catch (error) {

    return response.status(500).json({
        message : error.message || error,
        error : true,
        success : false
    }) 
    
}

}

// verify otp

export async function verifyForgotPasswordOtp(request,response){
    try {
        const { email , otp }  = request.body

        if(!email || !otp){
            return response.status(400).json({
                message : "Provide required field email, otp.",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const currentTime = new Date().toISOString()

        if(user.forgot_password_expiry < currentTime  ){
            return response.status(400).json({
                message : "Otp is expired",
                error : true,
                success : false
            })
        }

        if(otp !== user.forgot_password_otp){
            return response.status(400).json({
                message : "Invalid otp",
                error : true,
                success : false
            })
        }

        //if otp is not expired
        //otp === user.forgot_password_otp

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp : "",
            forgot_password_expiry : ""
        })
        
        return response.json({
            message : "Verify otp successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


//reset pasword

export async function resetPassword(request,response) {
    try {

        const {email,newPassword,confirmPassword}=request.body

        if(!email || ! newPassword ||!confirmPassword){
            return response.status(400).json({
                message : "provied all the requirments",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({email})

        if(!user){
            return response.status(400).json({
                message : "Invalid email",
                error : true,
                success : false
            })
        }

        if(newPassword !== confirmPassword){
            return response.status(400).json({
                message :"Password didn't matched",
                error : true,
                success : false
            })
        }

        const updatePassword= await UserModel.findOneAndUpdate(user._id,{
            password:newPassword
        })

        return response.status(200).json({
            message : "Password Updated successfully",
            error : false,
            success : true
        })
        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


// refresh token

export async function refreshToken(request,response) {
    try {
        const refreshToken=request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1] 

        if (!refreshToken){

            return response.status(401).json({
                message : "Invalid Token",
                error : true,
                success : false
            })  
        }
const verifyToken= await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

if (!verifyToken){

    return response.status(401).json({
        message : "Token expired",
        error : true,
        success : false
    })  
}

const userId=verifyToken?._id

const newAccessToken= await generatedAccessToken(userId)

const cookiesOption = {
    httpOnly : true,
    secure : true,
    sameSite : "None"
}

response.cookie('accessToken',newAccessToken,cookiesOption)

return response.status(200).json({
    message : "New token generated",
    error : false,
    success : true,
    data:{
        accessToken:newAccessToken
    }
}) 

    } catch (error) {

        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })  
    }
}


//user details

export async function userDetails(request,response) {
    try {
        const userId=request.userId;
        // console.log(userId)
        const user = await UserModel.findById(userId).select('-password -refresh_token')
return response.json({
    message:"User details",
    data:user,
    success:true,
    error:false
})

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        }) 
    }
    
}