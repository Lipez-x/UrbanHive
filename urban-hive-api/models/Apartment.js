const mongoose = require("../db/connection");
const { Schema } = mongoose;

const Apartment = mongoose.model(
  "Apartment",
  new Schema(
    {
      location: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      contact: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      image: {
        type: Array,
        required: true,
      },
      avaliable: {
        type: Boolean,
      },
      user: Object,
      lessee: Object,
    },
    { timestamps: true }
  )
);

module.exports = Apartment;
