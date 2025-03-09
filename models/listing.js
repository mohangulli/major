const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const listingSchema=new Schema({
    title:
    {
        type:String,
        required:true,
    },
    description:String,
    image:
    {
         
            url:String,
            filename:String,
           // default:
              //  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
// set:(v)=>v===""
 //?"https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
 //:v,
        
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user",
    },
    geometry:
{
          type:{

          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true,
        }
      }  

});

// listingSchema.post("findOneAndDelete",async(listing)=>{
//     if(listing){
// await Review.deleteMany({_id:{$in:listing.reviews}});
//     }
// });
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;