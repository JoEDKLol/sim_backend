const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()


const cors = require("cors")
let corspolicy = {
    origin:'http://localhost:3000'
}

const userRouter = require('./routes/userRoute')
const operatorUserRoute = require('./routes/operatorUserRoute')
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.json());
app.use(cors(corspolicy));
app.use(cookieParser());

const db = module.exports = () => {

    try{
        mongoose.connect(process.env.DBURI
        ,   {user:process.env.DBUSERNAME, pass:process.env.DBPASSWORD,
            useNewUrlParser:true, useUnifiedTopology:true
            }
        )
        console.log("MongoDB Connection is Successful")
    }catch(error){
        console.log("MongoDB Connection is failed")
    }
}

db();

app.use('/', (req, res, next) => {
    console.log('A new request received at : ', new Date());
    next();
});

app.use('/',userRouter)
app.use('/operatoruser',operatorUserRoute)

app.listen(process.env.PORT,()=>{
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})