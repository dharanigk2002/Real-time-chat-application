import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      ],
      validate: {
        validator(members) {
          return members.length === 2;
        },
        message: "A chat must have exactly 2 members",
      },
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
    },
    unreadMessageCount: {
      type: Number,
      default: 0,
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

const chatModel = mongoose.model("chat", chatSchema);
export default chatModel;
