const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
const orderSchema = new Schema(
  {
    products: [
      {
        product: {type: Object, required: true},
        quantity: {type: Number, required: true},
      }
    ],
    table: { 
      name: {
        type: String,
        required: true
      },
      tableId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "t"
      },
     },
     amount: { type: Number, required: true},
     status: {
       type: String,
       default: 'Waiting'
     }
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Order", orderSchema);