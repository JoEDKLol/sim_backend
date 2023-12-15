const mongoose = require('mongoose')

const OperatorUserSchema = mongoose.Schema({
    company_id : {
        type: mongoose.Schema.ObjectId,
        required: true,
        index:{unique:true}
    },
    user_id:{
        type: mongoose.Schema.ObjectId,
        required: true,
        index:{unique:true}
    },
    user : {  
        user_name:{
            type: String,
            required: true
        },
        user_email:{
            type: String,
            required: true
        }
    },
    delete_yn : {
        type: String,
        default: "n"
    },
    regDate : {
        type: Date,
        default: Date.now
    },
    regUser : {
        type: String,
        required: true
    },
    updDate : {
        type: Date,
        default: Date.now
    },
    updUser : {
        type: String,
        required: true
    }
}
)

const OperatorUser=mongoose.model('operator_user',OperatorUserSchema)
module.exports=OperatorUser