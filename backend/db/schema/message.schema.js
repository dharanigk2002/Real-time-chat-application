import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
      required: [true, "Chat id is required"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Sender is required"],
    },
    text: {
      type: String,
      trim: true,
    },
    image: String,
    read: {
      type: Boolean,
      default: false,
    },
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

const messageModel = mongoose.model("message", messageSchema);
export default messageModel;
