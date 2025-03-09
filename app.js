if(process.env.NODE_ENV!="production")
{
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const dbUrl=process.env.ATLASDB_URL;
const path=require("path");
const methodoverride=require("method-override");
app.use(express.urlencoded({extended:true}));
const ExpressError=require("./utils/ExpressError.js");
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate) ;// use to create templates
app.use(express.static(path.join(__dirname,"/public")));
const Review=require("./models/review.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const session=require("express-session");
const MongoStore = require('connect-mongo');

const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");



main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err)
});
async function main()
{
    await mongoose.connect(dbUrl);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(methodoverride("_method"));

// seesion store
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
      secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("error in mongo session store",err);
});
// session options
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUnintializes:true,
    cookie:{
        expires:Date.now()+7*24*60*60*10000,
        maxAge:7*24*60*60*10000,
        httpOnly:true
    }
}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));;
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// converting the schema validation into middleware validation

//const cors = require('cors');
//app.use(cors());  // Allow all origins



// app.get("/",(req,res)=>{
//     res.send("i am root");
// });

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
res.locals.currUser=req.user;
    next();
});
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"dalta1",
//     });
//     let registeruser=await User.register(fakeUser,"helloworld1");
//     res.send(registeruser);
// });
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>{
    let{statusCode=500,message="some thing went wrong "}=err;
    //  res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err});
})
app.listen(8080,()=>{
    console.log("i am listening port 8080");
});
