import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, redirect, useLoaderData } from "react-router";
import {
  getToken,
  getUser,
  setChats,
  setUser,
  setUsers,
} from "../../slice/userSlice.js";
import { getAllUsers, getLoggedUser } from "../api/users.js";
import { getAllChats } from "../api/chats.js";
import { useMemo } from "react";

export default function ProtectedRoute() {
  const dispatch = useDispatch();
  const data = useLoaderData();
  const token = useSelector(getToken);
  const user = useSelector(getUser);

  useMemo(() => {
    if (!data) return;
    dispatch(setUser(data.user.user));
    dispatch(setUsers(data.users.users));
    dispatch(setChats(data.chats.chats));
  }, [data]);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export async function loader() {
  const token = window.localStorage.getItem("token");

  if (!token) return redirect("/login");

  try {
    const [user, users, chats] = await Promise.all([
      getLoggedUser(token),
      getAllUsers(token),
      getAllChats(token),
    ]);

    return { success: true, user, users, chats };
  } catch (error) {
    return redirect("/login");
  }
}
