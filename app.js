//jshint esversion:6
require('dotenv').config(); 
const express = require("express"); 
const bodyParser = require("body-parser"); 
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express(); 

app.use(express.static("public")); 
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({extended: true})); 

mongoose.connect("mongodb://localhost:27017/userDB"); 

const userSchema = new mongoose.Schema({
    email: String, 
    password: String
}); 

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']}); 

const User = new mongoose.model("User", userSchema); 

app.get("/", function(req, res) {
    res.render("home"); 
});
app.get("/login", function(req, res) {
    res.render("login"); 
});
app.get("/register", function(req, res) {
    res.render("register"); 
});

app.post("/register", function(req, res) {

    if(req.body.username != "" && req.body.password != "") {

        const newUser = new User({
            email: req.body.username, 
            password: req.body.password
        }); 
        
        newUser.save(function(err){
            if(!err) {
                res.render("secrets"); 
            } else {
                res.send(err); 
            }
        }); 
    } else {
        console.log("You must fill in both fields!");
    }
}); 

app.post("/login", function(req, res) {
    User.findOne(
        {email: req.body.username},
        function(err, doc) {
            if(doc) {
                if(doc.password === req.body.password) {
                    res.render("secrets"); 
                } 
            } else {
                console.log("Name and password not found! Please try again.");
            }
        }
    );
});

app.get("/logout", function(req, res) {
    res.redirect("/"); 
}); 


app.listen(3000, function() {
    console.log("Server started on port 3000."); 
}); 