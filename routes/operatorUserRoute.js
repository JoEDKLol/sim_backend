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
  const operatorUserDate = await OperatorUser.find({company_id:new ObjectId(request.params.company_id)});
  try {
    // console.log(operatorUserDate);
    response.send(operatorUserDate);
  } catch (error) {
    response.status(500).send(error);
  }
});
operatorUserRoute.post("/regoperatoruser", getFields.none(), async (request, response) => {
  let userData = await Users.findOne({email:request.body.email});
  if(!userData){
      return response.send({
          "massage":"no users"
      });
  }else{

    return response.send({
        "massage":"users"
    });

  }
});

module.exports=operatorUserRoute