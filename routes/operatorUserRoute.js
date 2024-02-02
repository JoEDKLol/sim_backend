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

operatorUserRoute.get("/operatoruser/:company_id/:currentPage/:pageListCnt", async (request, response) => {
  
  const currentPage = parseInt(request.params.currentPage);
  const pageListCnt = parseInt(request.params.pageListCnt);
  const skipPage = pageListCnt*(currentPage-1);
  
  const totOperatorUserCnt = await OperatorUser.countDocuments({company_id:new ObjectId(request.params.company_id),delete_yn:"n"});
  const operatorUserDate = await OperatorUser
  .find({company_id:new ObjectId(request.params.company_id), delete_yn:"n"})
  .sort({updDate:-1})
  .skip(skipPage)
  .limit(pageListCnt);

  try {
    let sendData = {
      list:operatorUserDate,
      totCnt:totOperatorUserCnt,
      currentPage:currentPage,
      pageListCnt:pageListCnt,

    }
    // console.log(sendData);
    response.send(sendData);
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
        //  delete_yn:"n"
      });

      if(operatorUserData.length !== 0){ //find array return
        if(operatorUserData.delete_yn === "y"){
          //delete y update


        }else{
          return response.send({  
              "massage":"This email is already registered",
              "success":"n"
          });
        }
        
      }else{
          const OpUserObj = {
            company_id:request.body.company_id,
            user_id:userData._id,
            user:{
              user_name:userData.userName
              , user_email:userData.email
            }
            ,regUser:request.body.email
            ,updUser:request.body.email
          }


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
                  company_id:new ObjectId(request.body.company_id),
                  company_name:request.body.company_name,
                  regDate:date,
                  delete_yn:"n"
                }
              }
              , updDate:date
              , updUser:request.body.email

            }
          )
          


      }

      return response.send({  
        "massage":"",
        "success":"y"
      });
    }

  }catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
    
  });

  operatorUserRoute.post("/deloperatoruser", getFields.none(), async (request, response) => {

    try{
      let delOperatorUserData = await OperatorUser.findByIdAndDelete(request.body.id);
      let date = new Date().toISOString();
      let upUser = await Users.updateOne(
        {email:request.body.email},
        {  
          $pull: { 
            //{company_id:"", company_name:"", regDate:"", delete_yn:""}
            "companies_operator": {
              "company_id":new ObjectId(request.body.company_id),
            }
          }
          , updDate:date
          , updUser:request.body.updUser
        }
      )

      return response.send({  
        "massage":"",
        "success":"y"
      });
      
    }catch (error) {
      response.status(500).send(error);
    }

  });

module.exports=operatorUserRoute