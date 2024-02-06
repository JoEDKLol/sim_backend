const mongoose = require('mongoose')
const InventorySchema = mongoose.Schema({
    company_id : {
        type: mongoose.Schema.ObjectId,
        required: true,
        index:{unique:false}
    },
    sku_code : {
        type: String,
    },
    name : {
        type: String,
    },
    unit_price : {
        type: Number,
        default: 0
    },
    unit : {
        type: String,
        enum: ['EA'],
        default: 'EA'
    },
    photo:{
        type: String,
    },
    note : {
        type: String,
    },
    in_stock : {
        type: Number,
        default: 0
    },
    vendor : {
        type: String,
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


})


const inventory=mongoose.model('inventory',InventorySchema)
module.exports=inventory