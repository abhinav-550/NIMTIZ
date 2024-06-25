const express = require('express');
const path = require('path');
const app = express();
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const Router = express.Router();
const mainRoutes = require('./routes/main')
const flash = require('connect-flash')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;

const User = require('./models/users')

mongoose.connect('mongodb://127.0.0.1:27017/NIMITZ-DB')
.then(() => {
    console.log('Connection Successful!');
})
.catch((err) => {   
    console.log(err);
})


app.engine('ejs',ejsMate);
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded({extended:true})); 
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session({ secret : 'this-is-a-key', resave: false, saveUninitialized : false}))
app.use(flash());
app.set('view engine', 'ejs');



app.use('/' , mainRoutes);

app.listen(3000, () => {
    console.log("Server online!")
})

