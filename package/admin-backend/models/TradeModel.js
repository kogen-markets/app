const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const TradeSchema = new Schema(
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
    walletAddress: { type: String, required: true },
    prettyName: { type: String, required: true },
    result: { type: Schema.Types.Mixed, required: true },
  },
);

module.exports = mongoose.model("Trade", TradeSchema);
