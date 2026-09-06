import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Link } from "react-router";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { getToken, getUser, setUser } from "../../../slice/userSlice";
import { getFullName, getLettersOfName } from "../../utils";
import { uploadProfile } from "../../api/users";
import { socket } from "../../App";

export default function Profile() {
  const currentUser = useSelector(getUser);
  const token = useSelector(getToken);
  const [image, setImage] = useState(currentUser?.profilePic);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  async function handleImage(e) {
    const [file] = e.target.files;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("profile", file);
      const response = await uploadProfile(token, formData);
      toast.success(response.message);
      const profilePic = URL.createObjectURL(file);
      setImage(profilePic);
      dispatch(setUser({ ...response.user, blob: profilePic }));
      socket.emit("profile-change", { ...response.user });
    } catch (error) {
      toast.error("Profile picture did not uploaded correctly");
    } finally {
      setLoading(false);
    }
  }

  function handleProfile() {
    if (loading) return;
    fileRef.current?.click();
  }

  return (
    <div className="profile-page-container">
      <div
        className="profile-pic-container"
        role="button"
        onClick={handleProfile}
      >
        <div className={`profile-wrapper ${loading ? "loading" : ""}`}>
          {image ? (
            <img
              src={image}
              alt="Profile Pic"
              className="user-profile-pic-upload"
              onError={() => setImage(null)}
            />
          ) : (
            <p className="user-default-profile-avatar">
              {getLettersOfName(currentUser)}
            </p>
          )}
        </div>
      </div>

      <div className="profile-info-container">
        <div className="user-profile-name">
          <h1>{getFullName(currentUser)}</h1>
        </div>
        <div>
          <b>Email: </b>
          {currentUser?.email}
        </div>
        <div>
          <b>Account Created: </b>
          {moment(currentUser?.createdAt).format("MMM DD, YYYY")}
        </div>
        <div className="select-profile-pic-container">
          <input type="file" ref={fileRef} onChange={handleImage} />
        </div>
        <Link to="/" replace className="link">
          &larr; Back To Chat
        </Link>
      </div>
    </div>
  );
}
