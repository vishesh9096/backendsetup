const express = require("express");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);
const app = express();
const bycrypt = require('bcryptjs');
const mongoose = require("mongoose")
require('dotenv').config()
const userModel = require("./models/Users")
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
const mongo_uri = process.env.mongo_uri
mongoose.connect(mongo_uri,{
    useNewUrlParser : true,
    useUnifiedTopology: true,
}).then(res=>{
    console.log("DB connected");
});

app.use(express.urlencoded({extended:true}))

const store = new mongodbSession({
    uri:mongo_uri,
    collection:'userSessions'
})
app.use(session({
    secret:"key that will sign",
    resave:false,
    saveUninitialized: false,
    store:store,
}))

app.get("/",(req,res)=>{
    req.session.isAuth = true,
    console.log(req.session);
    res.send("Hello session tut");
});

// app.post("/register",async (req,res)=>{
//     const {username,email,password,phoneno} = req.body;
//     let user = await userModel.findOne({email});
//     if(user) {

//         return res.redirect('/register'); } 
//     // const hashpass = await bycrypt.hash(password,12);
//     user = new userModel({
//         username:"vish",
//         email:'hjfs@gmcil.cp',
//         password: '12345678',
//         phoneno: '11111111',ß
//     })

//     await user.save();
//     res.send("hello from register");


// });

app.post('/register', (req, res) => {
    const {username,email,password,phoneno} = req.body;
    console.log(req.body.email)
  
    // Validate input data (you can add more validation as needed)
    if (!username ) {
      return res.status(400).json({ error: 'Please provide all the username fields' });
    }
    if (!email ) {
        return res.status(400).json({ error: 'Please provide all the email fields' });
      }
      if (!password) {
        return res.status(400).json({ error: 'Please provide all the pass fields' });
      }
  
    // Create a new user object using the User model
    const newUser = new userModel({
      username:username,
      email:email,
      password:password,
      phoneno:phoneno,
    });
  
    // Save the user to the database
    newUser.save()
      .then(() => {
        res.status(201).json({ message: 'User registered successfully' ,
        status:"success",
    });
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.status(409).json({ error: 'Username or email already exists',
        status:"fail"
        });
        } else {
          res.status(500).json({ error: 'An error occurred while registering the user' });
        }
      });
  });


app.post("/login", async function(req, res){
  const {phoneno,sendotp,otp} = req.body;
  console.log(req.body.phoneno);
    try {
        // check if the user exists
        const user = await userModel.findOne({ phoneno: phoneno });
        if (user) {

          const result = true;
          if (result) {
            res.json({status:"logged in"});
          } else {
            res.status(400).json({ error: "otp doesn't match" });
          }
        } else {
          res.status(400).json({ error: "User doesn't exist" });
        }
      } catch (error) {
        res.status(400).json({ error });
      }
});

app.listen(8000,console.log("running onn 8000"));