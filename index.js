const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()

const cors = require("cors")
let corspolicy = {
    // origin:'http://localhost:3000'
    origin:process.env.FRONTEND_URL
}

const userRouter = require('./routes/userRoute')
const operatorUserRoute = require('./routes/operatorUserRoute');
const authUserRoute = require('./routes/authUserRoute');
const companyRoute = require('./routes/companyRoute');
const inventoryRoute = require('./routes/inventoryRoute');
// const cookieParser = require('cookie-parser')
// const verifyToken = require('./common/jwtCheck')

const app = express()

app.use(express.json());
app.use(
    cors({
      exposedHeaders: ['accesstoken','refreshtoken'],
    }),
  );
app.use(cors(corspolicy));



// app.use(cookieParser());

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

// app.use('/', (req, res, next) => {
//     console.log('A new request received at : ', new Date());
//     next();
// });

const verifyToken = (req, res, next) => {
  try {
      // console.log(req);
      // console.log(req.headers.authorization);
      req.decoded = jwt.verify(req.headers.authorization, process.env.ACCESS_TOKEN_SECRET)
      // console.log("acc 정상");
      // console.log(req.decoded.id);
      if(req.body.check === "isToken"){
        return res.status(200).send({
          code: 200,
          message: 'true',
          id:req.decoded.id,
          email:req.decoded.email,
        });
      }else{
        return next();
      }
      
  }
  
  catch(error) {

    try{
      req.decoded = jwt.verify(req.headers.refreshtoken, process.env.REFRESH_TOKEN_SECRET)
      //return next();
      res.setHeader("accesstoken", 
        jwt.sign({
          id:req.decoded.id,
          email:req.decoded.email,
          },process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"15m",
          })
        );
        res.setHeader("refreshtoken",
          jwt.sign({
            id:req.decoded.id,
            email:req.decoded.email,
          },process.env.REFRESH_TOKEN_SECRET,{
            expiresIn:"30 days",
          })
      );
      return res.status(200).send({
        code: 200,
        message: 'newToken'

      });
    }catch(error){
      if (error.name === 'TokenExpiredError') {
        return res.status(419).send({
          code: 419,
          message: 'TokenExpiredError'
        });
      }
      return res.status(401).send({
        code: 401,
        message: 'Not Token Type.'
      });
    }
    
  }
}

const checkToken = (strToken, gu) => {
  try{
    if(gu === "acc"){
      req.decoded = jwt.verify(strToken, process.env.ACCESS_TOKEN_SECRET)
    }else if(gu === "ref"){
      req.decoded = jwt.verify(strToken, process.env.REFRESH_TOKEN_SECRET)
    }
  }catch(e){
    throw new Error("Error");
  }  
}

app.use('/',userRouter)
app.use('/auth',verifyToken);
app.use('/auth',operatorUserRoute)
app.use('/auth',authUserRoute)
app.use('/auth',companyRoute)
app.use('/auth',inventoryRoute)

app.listen(process.env.PORT,()=>{
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})