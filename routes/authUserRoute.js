const express=require('express')
const multer=require('multer')
const authUserRoute=express.Router()
let getFields=multer()
const Users = require("../models/userSchemas");
const ObjectId = require("mongoose").Types.ObjectId;

authUserRoute.get("/user/:_id", async (request, response) => {
    try {
        const userDate = await Users.findById({_id:request.params._id});
        // response.send(userDate);
        response.send({
            id:userDate._id,
            userName:userDate.userName,
            email:userDate.email,
            role:userDate.role,
            companies_manager:userDate.companies_manager,
            companies_operator:userDate.companies_operator
        });
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports=authUserRoute