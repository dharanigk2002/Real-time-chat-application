import crypto from "crypto";
import User from "../db/schema/user.schema.js";
import { cloudinary } from "../cloudinary.js";

export async function getUser(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, error: "Please login again to continue" });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong on the server" });
  }
}

export async function getAllUsersExceptSelf(req, res) {
  try {
    const users = await User.findOtherUsers(req.user.id);
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong on the server" });
  }
}

export async function uploadProfile(req, res) {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, error: "No profile uploaded" });

    const fileHash = crypto
      .createHash("md5")
      .update(req.file.buffer)
      .digest("hex");
    const targetPublicId = `img-${fileHash}`;
    const expectedFolder = "quick-chat";

    const fullCloudinaryPath = `${expectedFolder}/${targetPublicId}`;

    const existingUserWithImage = await User.findOne({
      profilePic: { $regex: fullCloudinaryPath },
    });

    if (existingUserWithImage) {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { profilePic: existingUserWithImage.profilePic },
        { returnDocument: "after" },
      );

      return res.status(200).json({
        success: true,
        message: "Profile picture matched existing asset successfully",
        user,
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: expectedFolder,
        format: "png",
        public_id: targetPublicId,
        overwrite: true,
        invalidate: true,
      },
      async (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ success: false, error: "Cloudinary upload failed" });
        }

        // D. Update current user with the freshly generated Cloudinary URL
        const user = await User.findByIdAndUpdate(
          req.user.id,
          { profilePic: result.secure_url },
          { returnDocument: "after" },
        );

        return res.status(200).json({
          success: true,
          message: "Profile picture uploaded successfully",
          user,
        });
      },
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong on the server" });
  }
}
