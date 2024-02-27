import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler";

// POST @/api/user/login
export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("userLogin", req.body);
  try {
    const { email, password } = req.body;

    if (!email) {
      return next(
        new ErrorHandler("loginBackend.plz_enter_email_or_username", 422)
      );
    }

    if (!password) {
      return next(new ErrorHandler("loginBackend.plz_enter_pass", 422));
    }

    if (password.length < 6) {
      return next(new ErrorHandler("Invalid password", 422));
    }

    const user = await User.findOne({
      email: email,
    }).select("+password");

    if (!user) {
      return next(new ErrorHandler("No user found", 404));
    }

    const passwordMatch = password === user?.password;

    if (!passwordMatch) {
      return next(new ErrorHandler("Incorrect email or password", 400));
    }

    user.password = "";

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 8.64e7, // 1day
      secure: process.env.NODE_ENV === "production",
    });
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error: ", error);
    return next(new ErrorHandler("Something went wrong", 400));
  }
};

// GET @/api/user/profile
export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("REQ: ",req.userId)
  const userId = req.userId;
  try {
    const user = await User.findById(userId);

    if (!user) {
      next(new ErrorHandler("User not found", 404));
    }
console.log("USER:", user)
    res.status(200).json(user);
  } catch (error) {
    console.log("erro:", error)
    next(new ErrorHandler("Error retrieving user profile", 500));
  }
};

// POST @/api/user/login
export const userLogout = async (req: Request, res: Response) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  res.send("Logged out");
};
