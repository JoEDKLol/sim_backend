const mongoose = require('mongoose')

const OperatorUserSchema = mongoose.Schema({
    company_id : {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    user : {
        user_id:{
            type: mongoose.Schema.ObjectId,
            required: true
        },
        user_name:{
            type: String,
            required: true
        },
        user_email:{
            type: String,
            required: true
        }
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
}
)

const OperatorUser=mongoose.model('operator_user',OperatorUserSchema)
module.exports=OperatorUser