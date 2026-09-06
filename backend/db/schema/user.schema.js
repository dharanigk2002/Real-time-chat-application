import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email has already been taken"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      min: [8, "Password must be atleast 8 characters long"],
    },
    profilePic: String,
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        delete ret.__v;
      },
    },
  },
);

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email }).select("+password");
};

userSchema.statics.findOtherUsers = function (userId) {
  return this.find({ _id: { $ne: userId } });
};

const userModel = mongoose.model("user", userSchema);
export default userModel;
