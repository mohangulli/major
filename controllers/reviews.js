const Listing=require("../models/listing");
const Review=require("../models/review");


module.exports.createReview=async (req,res)=>{
    console.log(req.params.id);
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save(); 
    // when modify then we need to save
    //console.log("new reviw saved");
   // res.send("new review saved");
   // after review redirect same page
   req.flash("success","new review is added");

   res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyReview=async(req,res)=>
{
let {id,reviewId}=req.params;
await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});// deleting only listing
await Review.findByIdAndDelete(reviewId);
req.flash("success","review deleted");

res.redirect(`/listings/${id}`);
};