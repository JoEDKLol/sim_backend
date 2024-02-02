const express=require('express')
const ObjectId = require("mongoose").Types.ObjectId;
const multer=require('multer')
let getFields=multer()
const companyRoute=express.Router()
const Compnay = require("../models/companySchemas");
const Users = require("../models/userSchemas");
const OperatorUser = require("../models/operatorUserSchemas");
// companyRoute.get("/company", async (request, response) => {
//     // console.log(request.params.company_id);
//     const companyData = await Compnay.find();

//   try {
//     // console.log(companyData);
//     response.send(companyData);
//   } catch (error) {
//     response.status(500).send(error);
//   }
// });

companyRoute.get("/companysearch/:_id", async (request, response) => {
  const companyData = await Compnay.findById({_id:new ObjectId(request.params._id)});
  // console.log(request.params._id);
  try {
    // console.log(companyData);
    response.send(companyData);
  } catch (error) {
    response.status(500).send(error);
  }
});

companyRoute.post("/companysave", getFields.none(), async (request, response) => {
  // console.log(request.body);
  const companyObj = {
    name : request.body.name, 
    email : request.body.email,
    address : {
      city : request.body.address.city,
      state : request.body.address.state,
      zipcode : request.body.address.zipcode,
      no : request.body.address.no,
    },
    note : request.body.note, 
    delete_yn : 'n',
    regUser : request.body.useremail,
    updUser : request.body.useremail,
  }
// console.log(companyObj);
try {
  // console.log(request.body);
  const newCompany =new Compnay(companyObj);
  let companyInfo=await newCompany.save();
  // console.log(request.body.userId);
  let date = new Date().toISOString();
  let upUser = await Users.updateOne(
    {_id:new ObjectId(request.body.userId)},
    {  
      $addToSet: { 
        //{company_id:"", company_name:"", regDate:"", delete_yn:""}
        companies_manager: {
          company_id:companyInfo._id,
          company_name:companyInfo.name,
          regDate:date,
          delete_yn:"n"
        }
      }
      , updDate:date
      , updUser:request.body.email

    }
  )
  
  response.send({
    "massage":"",
    "success":"y"
  });
} catch (error) {
  console.log(error);
  response.status(500).send(error);
}
});


companyRoute.post("/delCompny", getFields.none(), async (request, response) => {
  // console.log(request.body.companyId);
  try{
    let delCompnyData = await Compnay.findByIdAndDelete(request.body.companyId);
    let delOperatorUserData = await OperatorUser.deleteMany({company_id:new ObjectId(request.body.companyId)});
    // console.log(delOperatorUserData); 
    let date = new Date().toISOString();
    let upUser = await Users.updateOne(
      {_id:new ObjectId(request.body.userId)},
      {  
        $pull: { 
          "companies_manager": {
            "company_id":new ObjectId(request.body.companyId),
          }
        }
        , updDate:date
        , updUser:request.body.updUser
      }
    )

    let upUser2 = await Users.updateMany(
      // {_id:new ObjectId(request.body.userId)},
      {  
        $pull: {
          "companies_operator": {
            "company_id":new ObjectId(request.body.companyId),
          }
        }
        // , updDate:date
        // , updUser:request.body.updUser
      }
    )
    response.send({
      "massage":"",
      "success":"y"
    });
    // console.log(upUser2);
  }catch (error) {
    response.status(500).send(error);
  }


});

companyRoute.post("/companyupdate", getFields.none(), async (request, response) => {
  // console.log(request.body);
  try{
    let date = new Date().toISOString();
    let upCom = await Compnay.updateOne(
      {_id:new ObjectId(request.body.companyId)},
      {  
        name:request.body.name,
        email:request.body.email,
        'address.city':request.body.address.city,
        'address.state':request.body.address.state,
        'address.zipcode':request.body.address.zipcode,
        'address.no':request.body.address.no
        ,note:request.body.note
        , updDate:date
        , updUser:request.body.useremail
      }
    )

    let upUser = await Users.updateOne(
      {_id:new ObjectId(request.body.userId)},
      {  
        $set: { 
          "companies_manager.$[element].company_name": request.body.name,
        }
      },
      {
        arrayFilters: [{ "element.company_id":new ObjectId(request.body.companyId) }] 
      },
      {
        updDate:date
        , updUser:request.body.updUser
      }
    )

    response.send({
      "massage":"",
      "success":"y"
    });

  }catch (error) {
    response.status(500).send(error);
  }
});



module.exports=companyRoute