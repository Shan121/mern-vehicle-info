import express from "express";
import { submitVehicleInfo } from "../controllers/vehicle";
import { vehicleInfoValidator } from "../validators/vehicle";
import multer from "multer";
import verifyToken from "../middlewares/auth";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});

const router = express.Router();

router.post(
  "/submit-info",
  verifyToken,
  upload.array("images", 10),
  vehicleInfoValidator,
  submitVehicleInfo
);

export default router;
