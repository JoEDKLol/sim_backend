const express=require('express')
const ObjectId = require("mongoose").Types.ObjectId;
const multer=require('multer')
let getFields=multer()

const operatorUserRoute=express.Router()
const OperatorUser = require("../models/operatorUserSchemas");

operatorUserRoute.get("/", async (request, response) => {
    const operatorUserDate = await OperatorUser.find({});
    try {
      response.send(operatorUserDate);
    } catch (error) {
      response.status(500).send(error);
    }
});

operatorUserRoute.get("/:company_id", async (request, response) => {
  const operatorUserDate = await OperatorUser.findOne({company_id:new ObjectId(request.params.company_id)});
  try {
    response.send(operatorUserDate);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports=operatorUserRoute