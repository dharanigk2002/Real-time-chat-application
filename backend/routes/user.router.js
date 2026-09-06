import express from "express";
import {
  getAllUsersExceptSelf,
  getUser,
  uploadProfile,
} from "../controller/user.controller.js";
import { authorize, isAuthenticated } from "../middleware/auth.middleware.js";
import { upload } from "../cloudinary.js";

const router = express.Router();
router.use(authorize);
router.get("/user", isAuthenticated, getUser);
router.get("/users", isAuthenticated, getAllUsersExceptSelf);
router.post(
  "/upload-profile-pic",
  isAuthenticated,
  upload.single("profile"),
  uploadProfile,
);

export default router;
