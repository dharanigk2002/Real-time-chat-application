import Chat from "../db/schema/chat.schema.js";
import Message from "../db/schema/message.schema.js";

export async function newMessage(req, res) {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    await Chat.findByIdAndUpdate(
      newMessage.chatId,
      { lastMessage: savedMessage._id, $inc: { unreadMessageCount: 1 } },
      { runValidators: true },
    );
    return res.status(201).json({ success: true, message: savedMessage });
  } catch (error) {
    const validations = {};
    Object.keys(error.errors).forEach(
      (key) => (validations[key] = error.errors[key].message),
    );
    if (Object.keys(validations))
      return res.status(400).json({ success: false, error: validations });
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getAllMessages(req, res) {
  try {
    const { chatId } = req.params;
    if (!chatId)
      return res
        .status(400)
        .json({ success: false, error: "chat id is missing" });
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    const validations = {};
    Object.keys(error.errors).forEach(
      (key) => (validations[key] = error.errors[key].message),
    );
    if (Object.keys(validations))
      return res.status(400).json({ success: false, error: validations });
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function clearUnreadMessage(req, res) {
  try {
    const chatId = req.params.chatId;
    console.log("Chat Id", chatId);
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { unreadMessageCount: 0 },
      { returnDocument: "after" },
    )
      .populate("lastMessage")
      .populate("members");
    if (!updatedChat)
      return res
        .status(404)
        .json({ success: false, error: "No such chat exists" });
    await Message.updateMany({ chatId, read: false }, { read: true });
    return res.status(200).json({
      success: true,
      message: "Unread message cleared successfully",
      data: updatedChat,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
