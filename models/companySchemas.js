const mongoose = require('mongoose')

const CompanySchema = mongoose.Schema({

    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
    },
    address : {
        type: Object,
        default: {
            city:"",
            state:"",
            zipcode:"",
            no:"",
        }
    },
    note : {
        type: String,
    },
    delete_yn : {
        type: String,
        default: "n"
    },
    regDate : {
        type: Date,
        default: new Date()
    },
    regUser : {
        type: String,
        required: true
    },
    updDate : {
        type: Date,
        default: new Date()
    },
    updUser : {
        type: String,
        required: true
    }


})

const Company=mongoose.model('company',CompanySchema)
module.exports=Company