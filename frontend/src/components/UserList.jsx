import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getChats,
  getSelectedChat,
  getUser,
  getUsers,
  setChats,
  setUsers,
} from "../../slice/userSlice";
import { getFullName } from "../utils";
import { socket } from "../App";
import User from "./User";

export default function UserList({ search }) {
  const users = useSelector(getUsers);
  const chats = useSelector(getChats);
  const currentUser = useSelector(getUser);
  const dispatch = useDispatch();
  const selectedChat = useSelector(getSelectedChat);
  const [online, setOnline] = useState(new Set());

  useEffect(() => {
    function handleOnlineUsers(data) {
      setOnline(new Set(data));
    }

    socket.on("online-users", handleOnlineUsers);

    return () => socket.off("online-users", handleOnlineUsers);
  }, [chats, selectedChat?._id]);

  useEffect(() => {
    function handleProfileChange(data) {
      if (data._id === currentUser?._id) return;

      dispatch(
        setUsers(users.map((user) => (user._id === data._id ? data : user))),
      );

      dispatch(
        setChats(
          chats.map((chat) => ({
            ...chat,
            members: chat.members.map((member) =>
              member._id === data._id
                ? { ...member, profilePic: data.profilePic }
                : member,
            ),
          })),
        ),
      );
    }

    socket.on("user-profile", handleProfileChange);
    return () => socket.off("user-profile", handleProfileChange);
  }, [chats, currentUser?._id, users]);

  const filteredUsers = useMemo(() => {
    return search
      ? users.filter((user) =>
          getFullName(user)
            .toLowerCase()
            ?.includes(search.trim().toLowerCase()),
        )
      : chats;
  }, [search, chats, users]);

  const unreadMessageCount = useCallback(
    (userId) => {
      return chats.find((ch) =>
        [ch.members[0]._id, ch.members[1]._id].includes(userId),
      )?.unreadMessageCount;
    },
    [chats],
  );

  return filteredUsers.map((user) => {
    let obj = user;
    if (obj.members) {
      user = obj.members.find((mem) => mem._id !== currentUser?._id);
    }

    const unreadCount = unreadMessageCount(user._id);

    return (
      <User
        user={user}
        key={user._id}
        unreadCount={unreadCount}
        online={online}
      />
    );
  });
}
