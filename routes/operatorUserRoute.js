const express=require('express')
const ObjectId = require("mongoose").Types.ObjectId;
const multer=require('multer')
let getFields=multer()
const operatorUserRoute=express.Router()
const OperatorUser = require("../models/operatorUserSchemas");
const Users = require("../models/userSchemas");

operatorUserRoute.get("/operatoruser", async (request, response) => {
    const operatorUserDate = await OperatorUser.find({});
    try {
      response.send(operatorUserDate);
    } catch (error) {
      response.status(500).send(error);
    }
});

operatorUserRoute.get("/operatoruser/:company_id", async (request, response) => {
  const operatorUserDate = await OperatorUser.find({company_id:new ObjectId(request.params.company_id), delete_yn:"n"});
  try {
    // console.log(operatorUserDate);
    response.send(operatorUserDate);
  } catch (error) {
    response.status(500).send(error);
  }
});
operatorUserRoute.post("/regoperatoruser", getFields.none(), async (request, response) => {
  try{
    if(request.body.operatorUserEmail === request.body.email){
      return response.send({  
        "massage":"You cannot register your email address.",
        "success":"n"
      });
    }

    let userData = await Users.findOne({email:request.body.operatorUserEmail, delete_yn:"n"});
    if(!userData){
        return response.send({  
            "massage":"There is no user email address",
            "success":"n"
        });
    }else{
      let operatorUserData = await OperatorUser.find(
        {company_id:new ObjectId(request.body.company_id), 
        "user.user_email":request.body.operatorUserEmail,
        // delete_yn:"n"
      });
      // return response.send({
      //     "massage":"users"
      // });
      if(!operatorUserData){
        return response.send({  
            "massage":"This email is already registered",
            "success":"n"
        });
      }{
        
        if(operatorUserData.delete_yn === "y"){



        }else{
          const OpUserObj = {
            company_id:request.body.company_id,
            user:{
              user_id:userData._id
              , user_name:userData.userName
              , user_email:userData.email
            }
            ,regUser:request.body.email
            ,updUser:request.body.email
          }
// console.log(OpUserObj);

          const newOperatorUser =new OperatorUser(OpUserObj);
          let operatorUser=await newOperatorUser.save();
          // console.log(userData._id);
          // console.log(userData.userName);
          // console.log(userData.email);
          //Transactions
          let date = new Date().toISOString();
          let upUser = await Users.updateOne(
              {_id:new ObjectId(userData._id)},
              {  
                $addToSet: { 
                  //{company_id:"", company_name:"", regDate:"", delete_yn:""}
                  companies_operator: {
                    company_id:request.body.company_id,
                    company_name:request.body.company_name,
                    regDate:date,
                    delete_yn:"n"
                  }
                }
              }
            )
          }


      }

      return response.send({  
        "massage":"",
        "success":"y"
      });
    }

  }catch (error) {
    response.status(500).send(error);
  }
    
});

module.exports=operatorUserRoute