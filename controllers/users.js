
const User=require("../models/user");


module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

//signup page
module.exports.signup=async (req,res)=>{
   
   // flash message redirect to sign page
    // if user already registed handle using try block
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err)
            {
                return next(err);
            }
            req.flash("success","welcome to wanderlust");
            res.redirect("/listings");
        });
        
    }catch(e)
    {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};
module.exports.login=async(req,res)=>{
    req.flash("success","welcome to wonderlust !");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
    };
    module.exports.logout=(req,res,next)=>{
        req.logOut((err)=>{
            if(err)
            {
               return  next(err);
            }
            req.flash("success","you  are logged out");
            res.redirect("/listings");
        })
    };