import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import EmojiPicker from "emoji-picker-react";
import {
  getChats,
  getSelectedChat,
  getToken,
  getUser,
  setChats,
} from "../../slice/userSlice";
import { getFullName } from "../utils";
import toast from "react-hot-toast";
import {
  clearUnreadMessageCount,
  getAllMessages,
  sendMessage,
} from "../api/message";
import { hideLoader, showLoader } from "../../slice/loaderSlice";
import { socket } from "../App";

export default function Chat() {
  const selectedChat = useSelector(getSelectedChat);
  const token = useSelector(getToken);
  const currentUser = useSelector(getUser);
  const chats = useSelector(getChats);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const ref = useRef(null);
  const timer = useRef(null);
  const [image, setImage] = useState("");

  const handleReceiveMessage = (newMessage) => {
    const updatedChats = chats
      .map((chat) => {
        if (chat._id !== newMessage.chatId) return chat;

        return {
          ...chat,
          lastMessage: newMessage,
          updatedAt: newMessage.createdAt,
          unreadMessageCount:
            selectedChat?._id === chat._id
              ? 0
              : (chat.unreadMessageCount ?? 0) + 1,
        };
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    dispatch(setChats(updatedChats));

    if (newMessage.chatId !== selectedChat?._id) return;

    setMessages((prev) => [...prev, newMessage]);
    if (newMessage.sender !== currentUser?._id) {
      void clearUnreadMessageAction();
    }
  };

  useEffect(() => {
    socket.on("receive-message", handleReceiveMessage);

    if (!selectedChat) return;
    void getAllMessagesAction();
    void clearUnreadMessageAction();

    socket.off("message-count-cleared").on("message-count-cleared", (data) => {
      if (data.chatId === selectedChat._id) {
        setMessages((prev) => prev.map((msg) => ({ ...msg, read: true })));
      }
    });

    socket.on("started-typing", (data) => {
      if (selectedChat?._id === data.chatId) {
        if (data.sender !== currentUser._id) {
          setIsTyping(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setIsTyping(false), 2000);
        }
      }
    });

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [selectedChat]);

  useEffect(() => {
    const chatArea = ref.current;
    if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
  }, [messages, isTyping]);

  if (!selectedChat) return null;

  async function sendMessageAction(e) {
    e.preventDefault();
    if (!message.trim() && !image) return;
    setShowPicker(false);
    try {
      const msg = {
        chatId: selectedChat._id,
        sender: currentUser._id,
        text: message,
        image,
      };

      dispatch(showLoader());
      const response = await sendMessage(token, msg);
      toast.success("Message sent successfully");
      setMessage("");
      setImage("");
      socket.emit("send-message", {
        ...response.message,
        members: selectedChat.members.map((mem) => mem._id),
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      dispatch(hideLoader());
    }
  }

  async function getAllMessagesAction() {
    try {
      const chats = await getAllMessages(token, selectedChat?._id);
      setMessages(chats.data);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  async function clearUnreadMessageAction() {
    socket.emit("clear-unread-message", {
      chatId: selectedChat._id,
      members: selectedChat.members.map((m) => m._id),
    });

    if (currentUser?._id === selectedChat?.lastMessage?.sender) return;
    try {
      dispatch(showLoader());
      const response = await clearUnreadMessageCount(token, selectedChat?._id);
      const updatedChat = chats.map((ch) =>
        ch._id === selectedChat._id ? response.data : ch,
      );
      dispatch(setChats(updatedChat));
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      dispatch(hideLoader());
    }
  }

  const formatTime = (timestamp) => {
    const now = moment();
    const diff = now.diff(moment(timestamp), "days");
    if (diff < 1) return `Today ${moment(timestamp).format("hh:mm A")}`;
    else if (diff === 1)
      return `Yesterday ${moment(timestamp).format("hh:mm A")}`;
    return moment(timestamp).format("MMM D, hh:mm A");
  };

  async function sendImage(e) {
    const [file] = e.target.files;
    const fileReader = new FileReader(file);
    fileReader.readAsDataURL(file);
    fileReader.onloadend = async function () {
      setImage(fileReader.result);
    };
  }

  const formatImage = async function (rawImage) {
    const response = await fetch(rawImage);
    const data = await response.blob();
    const url = URL.createObjectURL(data);
    window.open(url, "_blank");
  };

  return (
    <div className="app-chat-area">
      <div className="app-chat-area-header">
        {getFullName(
          selectedChat.members.find((member) => member._id !== currentUser._id),
        )}
      </div>
      <div className="main-chat-area" ref={ref}>
        {messages.map((msg) => (
          <div
            className={
              "message-container " +
              (msg.sender === currentUser?._id ? "sender" : "")
            }
            key={msg._id}
          >
            <div
              className={`send-message ${msg.sender === currentUser?._id && msg.read ? "read" : ""}`}
            >
              {msg.image && (
                <div
                  style={{
                    marginBottom: "5px",
                    textAlign: "center",
                  }}
                  onClick={() => formatImage(msg.image)}
                >
                  <img
                    style={{ cursor: "pointer" }}
                    src={msg.image}
                    alt="image"
                    width={120}
                    height={120}
                  />
                </div>
              )}
              <div>{msg.text}</div>
            </div>
            <small className="timestamp">{formatTime(msg.createdAt)}</small>
          </div>
        ))}
        {isTyping && (
          <small className="timestamp">
            <i>typing...</i>
          </small>
        )}
      </div>
      <div className="send-message-container">
        {image && (
          <div className="preview-wrapper">
            <div className="close" onClick={() => setImage("")}>
              &times;
            </div>
            <img src={image} alt="preview" />
          </div>
        )}
        <form onSubmit={sendMessageAction} className="send-message-div">
          <input
            type="text"
            className="send-message-input"
            placeholder="Type a message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              socket.emit("user-typing", {
                sender: currentUser._id,
                chatId: selectedChat._id,
                members: selectedChat.members.map((member) => member._id),
              });
            }}
            autoFocus
          />
          <div className="emoji-picker">
            {showPicker && (
              <EmojiPicker
                onEmojiClick={(e) => setMessage((msg) => msg + e.emoji)}
              />
            )}
          </div>
          <button
            className="send-btn"
            type="button"
            onClick={(e) => e.currentTarget.lastElementChild.click()}
          >
            <i
              className="fa fa-image"
              style={{ fontSize: "20px", cursor: "pointer", color: "#e74c3c" }}
            ></i>
            <input
              type="file"
              hidden
              onChange={sendImage}
              accept="image/png, image/jpg, image/jpeg, image/webp, image/gif"
            />
          </button>
          <button
            className="send-btn"
            type="button"
            onClick={() => setShowPicker((prev) => !prev)}
          >
            <i
              className="fa fa-smile-o send-message-btn"
              aria-hidden="true"
            ></i>
          </button>
          <button className="send-btn" disabled={!message && !image}>
            <i
              className="fa fa-paper-plane send-message-btn"
              aria-hidden="true"
            ></i>
          </button>
        </form>
      </div>
    </div>
  );
}
