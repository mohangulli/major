const { render } = require("ejs");
const Listing=require("../models/listing");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    };


    // new route

    module.exports.renderNewFrom=(req,res)=>{
    
        res.render("listings/new.ejs");
    };
    // show route
    module.exports.showListing=async(req,res)=>{
        let{id}=req.params;
        const listing=await Listing.findById(id)
        .populate({path:"reviews",
            populate:{
                path:"author",
            }
        })
        .populate("owner");
        if(!listing)
        {
           req.flash("error","listing you requested is delted") ;
           res.redirect("/listings");
        
        }
        console.log(listing);
        res.render("listings/show.ejs",{listing,map:process.env.MAP_TOKEN ,map1:listing.geometry.coordinates});
        };



        // create route
module.exports.createListing=async(req,res,next)=>{
let response=await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send()
       // console.log(response.body.features[0].geometry);
       // res.send("send");

    let url=req.file.path;
    let filename=req.file.filename;
   // console.log(url,"  ..",filename);
   const listing=new Listing(req.body.listing);
   req.flash("success","new listing is added");
 listing.owner=req.user._id;
 listing.image={url,filename};
 listing.geometry=response.body.features[0].geometry;
  let saveListing=await listing.save();
  console.log(saveListing);
 res.redirect("/listings");
 
};
// edit form
module.exports.renderEditForm=async(req,res)=>{
    let{id}=req.params;
const listing=await Listing.findById(id);
if(!listing)
    {
       req.flash("error","listing you requested is delted") ;
       res.redirect("/listings");
    
    }
    let orginalImageUrl=listing.image.url;
  //  orginalImageUrl=orginalImageUrl.replace("/upload","/upload/h_10,w_10");

res.render("listings/edit.ejs",{listing,orginalImageUrl});

};

///update route
module.exports.updateListing=async(req,res)=>{
    let{id}=req.params;  

let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();

    }
    req.flash("success"," listing is updated");

res.redirect(`/listings/${id}`);
};


// delete listing
module.exports.destroyListing=async (req,res)=>{
    
    let{id}=req.params;
let deleteListing=await Listing.findByIdAndDelete(id);
console.log(deleteListing);
req.flash("success"," listing is  deleted");

res.redirect("/listings");
    

};