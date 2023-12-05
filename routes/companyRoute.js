const express=require('express')
// const ObjectId = require("mongoose").Types.ObjectId;
const multer=require('multer')
let getFields=multer()
const companyRoute=express.Router()
const Compnay = require("../models/companySchemas");

companyRoute.get("/company/:company_id", async (request, response) => {
    console.log(request.params.company_id);
    const companyData = await Compnay.findById({_id:request.params.company_id});

  try {
    console.log(companyData);
    response.send(companyData);
  } catch (error) {
    response.status(500).send(error);
  }
});
module.exports=companyRoute