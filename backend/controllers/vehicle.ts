import { NextFunction, Request, Response } from "express";
import Vehicle from "../models/vehicle";
import ErrorHandler from "../utils/errorHandler";
import cloudinary from "cloudinary";

// POST @api/vehicle/submit-info
export const submitVehicleInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Vehicle Info:", req.body);
  console.log("Vehicle files:", req.files);
  try {
    const { carModel, price, phoneNumber, userId } = req.body;
    const imagesFiles = req.files as Express.Multer.File[];

    if (!carModel) {
      return next(new ErrorHandler("Car model is required", 422));
    }

    if (!price) {
      return next(new ErrorHandler("Price is required", 422));
    }

    if (!phoneNumber) {
      return next(new ErrorHandler("Phone number is required", 422));
    }

    if (!imagesFiles || imagesFiles.length < 1) {
      return next(new ErrorHandler("At least one image is required", 422));
    }

    if (imagesFiles.length > 10) {
      return next(new ErrorHandler("Images cannot be more than 10", 422));
    }

    const uploadImages = imagesFiles.map(async (image) => {
      const imageBuffer = Buffer.from(image.buffer).toString("base64");
      let dataURI = `data:image/png;base64,${imageBuffer}`;
      const res = await cloudinary.v2.uploader.upload(dataURI, {
        folder: "vehicle-info/images",
      });
      return res.secure_url;
    });

    const imageUrls = await Promise.all(uploadImages);

    const newVehicle = {
      userId: userId,
      carModel,
      price,
      phoneNumber,
      images: imageUrls,
    };

    const vehicle = await Vehicle.create(newVehicle);
    res.status(201).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    console.log("Error: ", error);
    return next(new ErrorHandler("Something went wrong", 500));
  }
};
