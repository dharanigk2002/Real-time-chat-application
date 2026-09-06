import Chat from "../db/schema/chat.schema.js";

export async function createNewChat(req, res) {
  try {
    const chat = new Chat(req.body);
    const savedChat = await chat.save();
    return res.status(201).json({
      success: true,
      message: "Chat created successfully",
      data: await savedChat.populate("members"),
    });
  } catch (error) {
    const errors = Object.keys(error.errors);
    const validationErrors = {};
    errors.forEach((key) => {
      validationErrors[key] = error.errors[key].message;
    });
    if (Object.keys(validationErrors))
      return res.status(400).json({ success: false, errors: validationErrors });
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong on the server" });
  }
}

export async function getAllChats(req, res) {
  try {
    const chats = await Chat.find({ members: req.user.id })
      .populate("members")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, chats });
  } catch (error) {
    const errors = Object.keys(error.errors);
    const validationErrors = {};
    errors.forEach((key) => {
      validationErrors[key] = error.errors[key].message;
    });
    if (Object.keys(validationErrors))
      return res.status(400).json({ success: false, errors: validationErrors });
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong on the server" });
  }
}
