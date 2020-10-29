const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    fullName: { type: String, required: true },
    gender: { type: String,  required: false, },
    mobile: { type: Number, unique: true },
    email: { type: String, required: false, max: 50, unique: true },
    class: { type: String, required: false, max: 20 },
    quailfication: { type: String, required: false, max: 20 },
    profilePic: { type: String, required: false, max: 50 },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    oldHash: [
      { 
        hash: { type: String, required: false },
        date: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true,
    strict: false
  }
);

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", schema);
