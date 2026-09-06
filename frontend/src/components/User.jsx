import { useDispatch, useSelector } from "react-redux";
import {
  getChats,
  getSelectedChat,
  getToken,
  getUser,
  setSelectedChat,
} from "../../slice/userSlice";
import { useCallback, useMemo } from "react";
import { getLettersOfName, getFullName } from "../utils";
import moment from "moment";
import { createNewChat } from "../api/chats";

export default function User({ user, unreadCount, online }) {
  const chats = useSelector(getChats);
  const currentUser = useSelector(getUser);
  const selectedChat = useSelector(getSelectedChat);
  const dispatch = useDispatch();
  const token = useSelector(getToken);

  async function createChat(member) {
    try {
      dispatch(showLoader());
      const response = await createNewChat(token, [currentUser._id, member]);
      toast.success(response.message);
      dispatch(addNewChat(response.data));
      dispatch(
        setSelectedChat(
          chats.find((c) =>
            [c.members[0]._id, c.members[1]._id].includes(member),
          ),
        ),
      );
    } catch (err) {
      const { error } = err.cause;
      toast.error(error);
    } finally {
      dispatch(hideLoader());
    }
  }

  const getLastMessage = (userId) => {
    const msg = chats.find((chat) =>
      [chat.members[0]._id, chat.members[1]._id].includes(userId),
    )?.lastMessage;

    if (!msg) return null;
    return msg.sender === currentUser?._id ? "You: " + msg.text : msg.text;
  };

  const getLastMessageTime = useCallback(
    (userId) => {
      const msg = chats.find((chat) =>
        [chat.members[0]._id, chat.members[1]._id].includes(userId),
      )?.lastMessage;
      if (!msg) return "";
      return moment(msg.createdAt).format("hh:mm A");
    },
    [chats],
  );

  const lastMessage = getLastMessage(user._id);

  function openChat(selectedUserId) {
    const chat = chats.find((c) =>
      [c.members[0]._id, c.members[1]._id].includes(selectedUserId),
    );
    chat && dispatch(setSelectedChat(chat));
  }

  const chatStarted = useMemo(() => {
    const set = new Set();
    for (const chat of chats)
      chat.members?.forEach((member) => set.add(member._id));
    return set;
  }, [chats]);

  const isChatSelected = useMemo(() => {
    return selectedChat?.members.map((m) => m._id).includes(user._id);
  }, [selectedChat, user._id]);

  return (
    <div
      className="user-search-filter"
      key={user._id}
      onClick={() => openChat(user._id)}
      title={user.email}
    >
      <div
        className={`filtered-user ${isChatSelected ? "selected-user" : undefined}`}
      >
        <div
          className={
            "filter-user-display" + (online?.has(user._id) ? " online" : "")
          }
        >
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile Pic"
              className="user-profile-image"
            />
          ) : (
            <div
              className={`user-profile user-default-avatar ${isChatSelected ? "selected-user-avatar" : undefined}`}
            >
              {getLettersOfName(user)}
            </div>
          )}
          <div className="filter-user-details">
            <div className="user-display-name">{getFullName(user)}</div>
            <div className="user-display-email">
              {lastMessage ?? user.email}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {!lastMessage?.startsWith("You:") && unreadCount > 0 && (
              <span className="unread-message">{unreadCount}</span>
            )}
            <div className="timestamp">{getLastMessageTime(user._id)}</div>
          </div>
          {!chatStarted.has(user._id) && (
            <div className="user-start-chat">
              <button
                className="user-start-chat-btn"
                onClick={() => createChat(user._id)}
              >
                Start Chat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
