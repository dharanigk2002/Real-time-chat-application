import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: window.localStorage.getItem("token") ?? null,
  user: null,
  users: [],
  chats: [],
  selectedChat: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      window.localStorage.setItem("token", action.payload);
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setUsers(state, action) {
      state.users = action.payload;
    },
    setChats(state, action) {
      state.chats = action.payload;
    },
    addNewChat(state, action) {
      state.chats.push(action.payload);
    },
    setSelectedChat(state, action) {
      state.selectedChat = action.payload;
    },
    logout(state) {
      window.localStorage.removeItem("token");
      state = initialState;
    },
  },
});

export const {
  setToken,
  setUser,
  setUsers,
  setChats,
  logout,
  addNewChat,
  setSelectedChat,
} = userSlice.actions;
export const getToken = (state) => state.user.token;
export const getUser = (state) => state.user.user;
export const getUsers = (state) => state.user.users;
export const getChats = (state) => state.user.chats;
export const getSelectedChat = (state) => state.user.selectedChat;

export default userSlice.reducer;
