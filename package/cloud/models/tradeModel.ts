import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    funds: [
      {
        amount: { type: String, required: true },
        denom: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Trade", tradeSchema);
