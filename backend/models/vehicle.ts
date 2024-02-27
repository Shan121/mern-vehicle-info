import mongoose from "mongoose";

export type VehicleType = {
  _id: string;
  userId: string;
  carModel: string;
  price: number;
  phoneNumber: string;
  images: string[];
};

const vehicleSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  carModel: {
    type: String,
    required: [true, "Car model is required"],
    minlength: [3, "Car model must have at least 3 letters"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    validate: {
      validator: function (v: string) {
        return /\d{11}/.test(v) && v.length === 11;
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid phone number`,
    },
  },
  images: {
    type: [String],
    required: [true, "At least one image is required"],
    validate: {
      validator: function (v: string[]) {
        return v.length >= 1 && v.length <= 10;
      },
      message: "Maximum 10 images are allowed",
    },
  },
});

const Vehicle = mongoose.model<VehicleType>("Vehicle", vehicleSchema);

export default Vehicle;
