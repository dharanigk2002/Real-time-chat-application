import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../../slice/userSlice";
import { getFullName, getLettersOfName } from "../utils";
import { Link, useNavigate } from "react-router";
import { socket } from "../App";

export default function Header() {
  const user = useSelector(getUser) ?? {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function logoutAction() {
    socket.disconnect();
    dispatch(logout());
    navigate("/login");
  }

  return (
    <div className="app-header">
      <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
        Quick Chat
      </div>
      <div className="app-user-profile">
        <div className="logged-user-name">{getFullName(user)}</div>
        <Link to="/user" className="logged-user-profile-pic" title="you">
          {user.profilePic ? (
            <img src={user.profilePic} alt={user.name} />
          ) : (
            getLettersOfName(user)
          )}
        </Link>
        <button className="logout-button" onClick={logoutAction}>
          <i className="fa fa-power-off"></i>
        </button>
      </div>
    </div>
  );
}
