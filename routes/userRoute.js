const express=require('express')
const multer=require('multer')
const dotenv = require('dotenv')
dotenv.config()
const jwt=require('jsonwebtoken')

const userRoute=express.Router()
let getFields=multer()
const Users = require("../models/userSchemas");
const UserPwdChgReq = require("../models/userPwdChgReqSchemas");
const ObjectId = require("mongoose").Types.ObjectId;

// userRoute.get("/user", async (request, response) => {
//     const userDate = await Users.find({});
//     try {
//         response.send(userDate);
//     } catch (error) {
//         response.status(500).send(error);
//     }
// });

// userRoute.get("/user/:_id", async (request, response) => {
//     try {
//         const userDate = await Users.findById({_id:request.params._id});
    
//         response.send(userDate);
//     } catch (error) {
//         response.status(500).send(error);
//     }
// });

userRoute.post("/login", getFields.none(), async (request, response) => {
    try {
        // let userData = await Users.findOne({email:request.body.email,password:request.body.password});
        
        let userData = await Users.findOne({email:request.body.email});
        if(!userData){
            return response.send({
                "loginYn":"n",
                // massage:"There is no user matching your email address."
                "massage":""
            });
        }

        if(userData){
            
            let res = await userData.comparePassword(request.body.password);
            if(!res){
                if(userData.loginAttemptsCnt >= 10){
                    response.send({
                        loginYn:"n", 
                        massage:""
                    });
                }else{
                    let upRes = await Users.updateOne({_id:userData._id}
                        ,{"loginAttemptsCnt":userData.loginAttemptsCnt+1})
                    response.send({
                        loginYn:"n", 
                        massage:""
                    });
                }
            }else{
                if(userData.loginAttemptsCnt >= 10){
                    response.send({
                        loginYn:"n", 
                        massage:"Login Attempts Exceeded"
                    });
                }else{ 
                    if(userData.loginAttemptsCnt > 0){
                        let upRes = await Users.updateOne({_id:userData._id}
                            ,{"loginAttemptsCnt":0})
                    }

                    // let id = userData._id;
                    // response.setHeader({
                    //     jwt:{
                    //         // accessToken:token.access(userData._id),
                    //         // refreshToken:token.refresh(userData._id)
                            
                    //         accessToken:jwt.sign({
                    //             id:userData._id,
                    //             email:userData.email,

                    //         },process.env.ACCESS_TOKEN_SECRET,{
                    //             expiresIn:"15m",
                    //             issuer:"sim_master"
                    //         }),
                    //         refreshToken:jwt.sign({
                    //             id:userData._id,
                    //             email:userData.email,
                    //         },process.env.REFRESH_TOKEN_SECRET,{
                    //             expiresIn:"30 days",
                    //             issuer:"sim_master"
                    //         })
                    //     }
                    // });
                    response.setHeader("accesstoken", 
                        jwt.sign({
                            id:userData._id,
                            email:userData.email,

                        },process.env.ACCESS_TOKEN_SECRET,{
                            expiresIn:"15m",
                            // issuer:"sim_master"
                        })
                    );
                    response.setHeader("refreshtoken",
                        jwt.sign({
                            id:userData._id,
                            email:userData.email,
                        },process.env.REFRESH_TOKEN_SECRET,{
                            expiresIn:"30 days",
                            // issuer:"sim_master"
                        })
                    );
                    response.send({
                        loginYn:"y",
                        massage:"login success",
                        loginId:userData._id,
                        userName:userData.userName,
                        role:userData.role,
                        email:userData.email,
                        
                    })

                    // console.log(response.getHeader("accessToken"));

                    // response.send(userData);

                }
            }            
        }

    } catch (error) {
        response.status(500).send(error);
    }
});

userRoute.post("/signup", getFields.none(), async (request, response) => {
    
    request.body.regUser = request.body.email;
    request.body.updUser = request.body.email;
    
    const newuser=new Users(request.body)
    try {
        let user=await newuser.save();
        user = user.toObject();

        response.send({
            userName:user.userName,
            signyn:"y"
        });
    }catch (error) {
        if(error.code == "11000"){ //duplicate
            // console.log(error);
            response.send(error);
        }else{
            // console.log(error);
            response.status(500).send(error);
        }
    }
});

userRoute.post("/fpChackEmail", getFields.none(), async (request, response) => {

    try{
        let userData = await Users.findOne({email:request.body.email});

        if(userData){
            response.send({
                user_id:userData._id,
                fpChackEmail:"y"
            });
        }

    }
    catch{
        response.status(500).send(error);
    }
});


userRoute.post("/fpChgReqSave", getFields.none(), async (request, response) => {
    
    const body = {
        user_id : request.body.user_id,
        email_number : request.body.email_number,
        regUser:request.body.regUser,
        updUser:request.body.regUser,

    }
    const newUserPwdChgReq=new UserPwdChgReq(body)
    try
    {
        let retUserPwdChgReq=await newUserPwdChgReq.save();
        response.send({
            user_id:retUserPwdChgReq.user_id,
            fpChgReqSave:"y"
        });
    }
    catch
    {
        response.status(500).send(error);
    }
     

});

userRoute.post("/confirmCheck", getFields.none(), async (request, response) => {

    let number = parseInt(request.body.number);
    
    try{
        let confirmCheck = await UserPwdChgReq.findOne({
            user_id:new ObjectId(request.body.user_id), 
            email_number:number, 
            delete_yn:"n"
        }).sort({regDate:-1});
        
        if(confirmCheck){
            response.send({
                user_id:confirmCheck.user_id,
                confirmCheck:"y"
            });
        }else{
            response.send({
                confirmCheck:"n"
            });
        }
    }catch{

    }
     
});

userRoute.post("/updatePassword", getFields.none(), async (request, response) => {
    try
    {
        let date = new Date().toISOString();
        let upRes = await Users.updateOne(
            {_id:new ObjectId(request.body.user_id)},
            {  
                "password":request.body.password, 
                "loginAttemptsCnt":0,
                "updDate":date,
                "updUser":request.body.email
            }
        )

        let userPwdChgReqUpdate = await UserPwdChgReq.updateMany(
            {   
                user_id:new ObjectId(request.body.user_id),
                delete_yn:"n",
            },
            {
                "delete_yn":"y",
                "updDate":date,
                "updUser":request.body.email
            },
            {"multi": true}
        )

        response.send({
            updatePassword:"y"
        });
        
    }
    catch
    {

    }
});

userRoute.post("/test", getFields.none(), async (request, response) => {
    try {
        
        // console.log(request);

        response.send(200);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports=userRoute
