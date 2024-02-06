const express=require('express')
const ObjectId = require("mongoose").Types.ObjectId;
const multer=require('multer')
let getFields=multer()
const inventoryRoute=express.Router()
// const Compnay = require("../models/companySchemas");
// const Users = require("../models/userSchemas");
// const OperatorUser = require("../models/operatorUserSchemas");
const Inventory = require("../models/inventorySchemas");

inventoryRoute.get("/inventorysearch/:company_id", async (request, response) => {
    // console.log(request.params.company_id);
    const inventoryData = await Inventory.findOne({company_id:new ObjectId(request.params.company_id)});
    // const inventoryData = await Inventory.find();
    try {
      // console.log(companyData);
      response.send(inventoryData);
    } catch (error) {
      response.status(500).send(error);
    }
  });




module.exports=inventoryRoute