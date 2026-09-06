import Chat from "../../components/Chat.jsx";
import Header from "../../components/Header.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getUser } from "../../../slice/userSlice.js";
import { socket } from "../../App.jsx";

export default function Home() {
  const user = useSelector(getUser);

  useEffect(() => {
    if (!user) return;
    socket.emit("join-room", user._id);
    socket.emit("user-login", user._id);
  }, [user]);

  return (
    <div className="home-page">
      <Header />
      <div className="main-content">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}
